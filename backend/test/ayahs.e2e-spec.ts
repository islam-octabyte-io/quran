import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './setup-app';

describe('Ayahs (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('resolves the same ayah by global number, UCI, and surah:ayah', async () => {
    const byNumber = await request(app.getHttpServer()).get('/ayahs/262').expect(200);
    const byUci = await request(app.getHttpServer()).get('/ayahs/QA262').expect(200);
    const byRef = await request(app.getHttpServer()).get('/ayahs/2:255').expect(200);

    expect(byNumber.body.uci).toBe('QA262');
    expect(byUci.body.uci).toBe('QA262');
    expect(byRef.body.uci).toBe('QA262');
    expect(byRef.body.surahUci).toBe('QS2');
    expect(byRef.body.numberInSurah).toBe(255);
  });

  it('returns the default (quran-simple) edition text', async () => {
    const res = await request(app.getHttpServer()).get('/ayahs/1').expect(200);
    expect(res.body.texts).toHaveLength(1);
    expect(res.body.texts[0].edition).toBe('quran-simple');
    expect(res.body.texts[0].language).toBe('ar');
    expect(typeof res.body.texts[0].text).toBe('string');
    expect(res.body.texts[0].text.length).toBeGreaterThan(0);
  });

  it('honors ?edition= to pick a single edition', async () => {
    const res = await request(app.getHttpServer())
      .get('/ayahs/1?edition=ur-kanzuliman')
      .expect(200);
    expect(res.body.texts).toHaveLength(1);
    expect(res.body.texts[0].edition).toBe('ur-kanzuliman');
    expect(res.body.texts[0].language).toBe('ur');
  });

  it('honors comma-separated ?edition= preserving order', async () => {
    const res = await request(app.getHttpServer())
      .get('/ayahs/1?edition=ur-kanzuliman,quran-simple')
      .expect(200);
    expect(res.body.texts.map((t: { edition: string }) => t.edition)).toEqual([
      'ur-kanzuliman',
      'quran-simple',
    ]);
  });

  it('returns 404 for an out-of-range ayah number', async () => {
    await request(app.getHttpServer()).get('/ayahs/9999').expect(404);
  });

  it('returns 404 for an unknown edition', async () => {
    await request(app.getHttpServer()).get('/ayahs/1?edition=nope').expect(404);
  });
});
