import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './setup-app';

describe('Surah ayahs (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /surahs/1/ayahs returns all 7 ayahs of Al-Fatihah in order', async () => {
    const res = await request(app.getHttpServer()).get('/surahs/1/ayahs').expect(200);
    expect(res.body).toHaveLength(7);
    expect(res.body[0].numberInSurah).toBe(1);
    expect(res.body[6].numberInSurah).toBe(7);
    expect(res.body.every((a: { surahUci: string }) => a.surahUci === 'QS1')).toBe(true);
  });

  it('resolves the surah by UCI too', async () => {
    const res = await request(app.getHttpServer()).get('/surahs/QS1/ayahs').expect(200);
    expect(res.body).toHaveLength(7);
  });

  it('carries the per-surah bismillah on the first ayah of a prefixed surah', async () => {
    const res = await request(app.getHttpServer()).get('/surahs/2/ayahs').expect(200);
    expect(res.body[0].texts[0].bismillah).toBeTruthy();
  });

  it('returns 404 for an unknown surah', async () => {
    await request(app.getHttpServer()).get('/surahs/999/ayahs').expect(404);
  });
});
