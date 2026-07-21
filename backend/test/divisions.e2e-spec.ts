import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './setup-app';

describe('Divisions (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /juzs lists all 30 juzs', async () => {
    const res = await request(app.getHttpServer()).get('/juzs').expect(200);
    expect(res.body).toHaveLength(30);
  });

  it('GET /manzils lists all 7 manzils', async () => {
    const res = await request(app.getHttpServer()).get('/manzils').expect(200);
    expect(res.body).toHaveLength(7);
  });

  it('GET /juzs/1 resolves a single juz by number', async () => {
    const res = await request(app.getHttpServer()).get('/juzs/1').expect(200);
    expect(res.body.uci).toBe('QJ1');
    expect(res.body.number).toBe(1);
  });

  it('GET /juzs/QJ1/ayahs returns the juz ayahs with text, in Quran order', async () => {
    const res = await request(app.getHttpServer()).get('/juzs/1/ayahs').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].number).toBe(1);
    expect(res.body.every((a: { juzUci: string }) => a.juzUci === 'QJ1')).toBe(true);
    expect(res.body[0].texts[0].edition).toBe('quran-simple');
  });

  it('GET /rukus/1/ayahs honors ?edition=', async () => {
    const res = await request(app.getHttpServer())
      .get('/rukus/1/ayahs?edition=ur-kanzuliman')
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].texts[0].edition).toBe('ur-kanzuliman');
  });

  it('returns 404 for an out-of-range division', async () => {
    await request(app.getHttpServer()).get('/juzs/99').expect(404);
    await request(app.getHttpServer()).get('/manzils/99/ayahs').expect(404);
  });
});
