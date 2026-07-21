import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe, cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Validate every incoming request body/query against its Zod-derived DTO.
  app.useGlobalPipes(new ZodValidationPipe());

  // Interactive API docs at /docs, raw OpenAPI JSON at /docs-json.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Quran API')
    .setDescription(
      'Read access to the Quran: surahs, ayahs (with per-edition text), ' +
        'editions, and the five reading divisions (juz, hizb, rub, ruku, manzil).',
    )
    .setVersion('1.0')
    .addTag('Surahs', 'The 114 surahs and their ayahs')
    .addTag('Ayahs', 'Individual ayahs with per-edition text')
    .addTag('Editions', 'Text editions: originals, translations, transliterations')
    .addTag('Divisions', 'Reading divisions: juz, hizb, rub, ruku, manzil')
    .addTag('Health', 'Service and database health')
    .build();
  // cleanupOpenApiDoc post-processes the Zod-derived schemas into valid OpenAPI.
  const document = cleanupOpenApiDoc(
    SwaggerModule.createDocument(app, swaggerConfig),
  );
  SwaggerModule.setup('docs', app, document, { jsonDocumentUrl: 'docs-json' });

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`quran-api listening on http://localhost:${port}`);
  console.log(`API docs at http://localhost:${port}/docs`);
}

void bootstrap();
