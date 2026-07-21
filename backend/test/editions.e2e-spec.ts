import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './setup-app';

describe('Editions (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /editions lists all seeded editions ordered by number', async () => {
    const res = await request(app.getHttpServer()).get('/editions').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    const numbers = res.body.map((e: { number: number }) => e.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });

  it('GET /editions?language=ur returns only Urdu editions', async () => {
    const res = await request(app.getHttpServer())
      .get('/editions?language=ur')
      .expect(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body.every((e: { language: string }) => e.language === 'ur')).toBe(true);
  });

  it('GET /editions?type=translation returns only translations', async () => {
    const res = await request(app.getHttpServer())
      .get('/editions?type=translation')
      .expect(200);
    expect(res.body.every((e: { type: string }) => e.type === 'translation')).toBe(true);
  });

  it('GET /editions?type=bogus is rejected by validation', async () => {
    await request(app.getHttpServer()).get('/editions?type=bogus').expect(400);
  });

  it('GET /editions/:slug resolves by slug', async () => {
    const res = await request(app.getHttpServer())
      .get('/editions/quran-simple')
      .expect(200);
    expect(res.body.slug).toBe('quran-simple');
    expect(res.body.uci).toBe('QE1');
  });

  it('GET /editions/:number resolves by number', async () => {
    const res = await request(app.getHttpServer()).get('/editions/1').expect(200);
    expect(res.body.slug).toBe('quran-simple');
  });

  it('GET /editions/:unknown returns 404', async () => {
    await request(app.getHttpServer()).get('/editions/does-not-exist').expect(404);
  });
});
