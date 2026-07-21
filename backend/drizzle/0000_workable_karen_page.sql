CREATE TYPE "public"."edition_type" AS ENUM('original', 'translation', 'transliteration');--> statement-breakpoint
CREATE TYPE "public"."revelation_place" AS ENUM('meccan', 'medinan');--> statement-breakpoint
CREATE TYPE "public"."sajda_type" AS ENUM('recommended', 'obligatory');--> statement-breakpoint
CREATE TABLE "ayahs" (
	"uci" text PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"surah_uci" text NOT NULL,
	"number_in_surah" smallint NOT NULL,
	"sajda" "sajda_type",
	"juz_uci" text NOT NULL,
	"hizb_uci" text NOT NULL,
	"rub_uci" text NOT NULL,
	"ruku_uci" text NOT NULL,
	"manzil_uci" text NOT NULL,
	CONSTRAINT "ayahs_number_unique" UNIQUE("number"),
	CONSTRAINT "ayahs_surah_position" UNIQUE("surah_uci","number_in_surah"),
	CONSTRAINT "ayahs_uci_format" CHECK ("ayahs"."uci" = 'QA' || "ayahs"."number"::text),
	CONSTRAINT "ayahs_number_range" CHECK ("ayahs"."number" BETWEEN 1 AND 6236)
);
--> statement-breakpoint
CREATE TABLE "hizbs" (
	"uci" text PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"juz_uci" text NOT NULL,
	"number_in_juz" smallint NOT NULL,
	CONSTRAINT "hizbs_number_unique" UNIQUE("number"),
	CONSTRAINT "hizbs_juz_position" UNIQUE("juz_uci","number_in_juz"),
	CONSTRAINT "hizbs_uci_format" CHECK ("hizbs"."uci" = 'QH' || "hizbs"."number"::text),
	CONSTRAINT "hizbs_number_range" CHECK ("hizbs"."number" BETWEEN 1 AND 60)
);
--> statement-breakpoint
CREATE TABLE "juzs" (
	"uci" text PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"start_ayah_number" integer NOT NULL,
	"end_ayah_number" integer NOT NULL,
	CONSTRAINT "juzs_number_unique" UNIQUE("number"),
	CONSTRAINT "juzs_uci_format" CHECK ("juzs"."uci" = 'QJ' || "juzs"."number"::text),
	CONSTRAINT "juzs_number_range" CHECK ("juzs"."number" BETWEEN 1 AND 30),
	CONSTRAINT "juzs_ayah_range" CHECK ("juzs"."start_ayah_number" <= "juzs"."end_ayah_number")
);
--> statement-breakpoint
CREATE TABLE "manzils" (
	"uci" text PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"start_surah_uci" text NOT NULL,
	"end_surah_uci" text NOT NULL,
	CONSTRAINT "manzils_number_unique" UNIQUE("number"),
	CONSTRAINT "manzils_uci_format" CHECK ("manzils"."uci" = 'QM' || "manzils"."number"::text),
	CONSTRAINT "manzils_number_range" CHECK ("manzils"."number" BETWEEN 1 AND 7)
);
--> statement-breakpoint
CREATE TABLE "rubs" (
	"uci" text PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"hizb_uci" text NOT NULL,
	"number_in_hizb" smallint NOT NULL,
	"number_in_juz" smallint NOT NULL,
	"start_ayah_number" integer NOT NULL,
	"end_ayah_number" integer NOT NULL,
	CONSTRAINT "rubs_number_unique" UNIQUE("number"),
	CONSTRAINT "rubs_hizb_position" UNIQUE("hizb_uci","number_in_hizb"),
	CONSTRAINT "rubs_uci_format" CHECK ("rubs"."uci" = 'QR' || "rubs"."number"::text),
	CONSTRAINT "rubs_number_range" CHECK ("rubs"."number" BETWEEN 1 AND 240),
	CONSTRAINT "rubs_ayah_range" CHECK ("rubs"."start_ayah_number" <= "rubs"."end_ayah_number")
);
--> statement-breakpoint
CREATE TABLE "rukus" (
	"uci" text PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"surah_uci" text NOT NULL,
	"number_in_surah" smallint NOT NULL,
	"juz_uci" text NOT NULL,
	"number_in_juz" smallint NOT NULL,
	"start_ayah_number" integer NOT NULL,
	"end_ayah_number" integer NOT NULL,
	"ayah_count" smallint NOT NULL,
	CONSTRAINT "rukus_number_unique" UNIQUE("number"),
	CONSTRAINT "rukus_surah_position" UNIQUE("surah_uci","number_in_surah"),
	CONSTRAINT "rukus_uci_format" CHECK ("rukus"."uci" = 'QK' || "rukus"."number"::text),
	CONSTRAINT "rukus_number_range" CHECK ("rukus"."number" BETWEEN 1 AND 556),
	CONSTRAINT "rukus_ayah_range" CHECK ("rukus"."start_ayah_number" <= "rukus"."end_ayah_number")
);
--> statement-breakpoint
CREATE TABLE "ayah_texts" (
	"uci" text PRIMARY KEY NOT NULL,
	"ayah_uci" text NOT NULL,
	"edition_uci" text NOT NULL,
	"text" text NOT NULL,
	"bismillah" text,
	CONSTRAINT "ayah_texts_ayah_edition" UNIQUE("ayah_uci","edition_uci"),
	CONSTRAINT "ayah_texts_uci_format" CHECK ("ayah_texts"."uci" = 'QT' || substring("ayah_texts"."edition_uci" from 3) || lpad(substring("ayah_texts"."ayah_uci" from 3), 4, '0'))
);
--> statement-breakpoint
CREATE TABLE "editions" (
	"uci" text PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"language" text NOT NULL,
	"type" "edition_type" NOT NULL,
	CONSTRAINT "editions_number_unique" UNIQUE("number"),
	CONSTRAINT "editions_slug_unique" UNIQUE("slug"),
	CONSTRAINT "editions_uci_format" CHECK ("editions"."uci" = 'QE' || "editions"."number"::text)
);
--> statement-breakpoint
CREATE TABLE "surahs" (
	"uci" text PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"name_arabic" text NOT NULL,
	"name_english" text NOT NULL,
	"revelation_place" "revelation_place" NOT NULL,
	"revelation_order" smallint NOT NULL,
	"ayah_count" smallint NOT NULL,
	"ruku_count" smallint NOT NULL,
	"bismillah_prefix" boolean NOT NULL,
	CONSTRAINT "surahs_number_unique" UNIQUE("number"),
	CONSTRAINT "surahs_uci_format" CHECK ("surahs"."uci" = 'QS' || "surahs"."number"::text),
	CONSTRAINT "surahs_number_range" CHECK ("surahs"."number" BETWEEN 1 AND 114)
);
--> statement-breakpoint
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_surah_uci_surahs_uci_fk" FOREIGN KEY ("surah_uci") REFERENCES "public"."surahs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_juz_uci_juzs_uci_fk" FOREIGN KEY ("juz_uci") REFERENCES "public"."juzs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_hizb_uci_hizbs_uci_fk" FOREIGN KEY ("hizb_uci") REFERENCES "public"."hizbs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_rub_uci_rubs_uci_fk" FOREIGN KEY ("rub_uci") REFERENCES "public"."rubs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_ruku_uci_rukus_uci_fk" FOREIGN KEY ("ruku_uci") REFERENCES "public"."rukus"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_manzil_uci_manzils_uci_fk" FOREIGN KEY ("manzil_uci") REFERENCES "public"."manzils"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hizbs" ADD CONSTRAINT "hizbs_juz_uci_juzs_uci_fk" FOREIGN KEY ("juz_uci") REFERENCES "public"."juzs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manzils" ADD CONSTRAINT "manzils_start_surah_uci_surahs_uci_fk" FOREIGN KEY ("start_surah_uci") REFERENCES "public"."surahs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manzils" ADD CONSTRAINT "manzils_end_surah_uci_surahs_uci_fk" FOREIGN KEY ("end_surah_uci") REFERENCES "public"."surahs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rubs" ADD CONSTRAINT "rubs_hizb_uci_hizbs_uci_fk" FOREIGN KEY ("hizb_uci") REFERENCES "public"."hizbs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rukus" ADD CONSTRAINT "rukus_surah_uci_surahs_uci_fk" FOREIGN KEY ("surah_uci") REFERENCES "public"."surahs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rukus" ADD CONSTRAINT "rukus_juz_uci_juzs_uci_fk" FOREIGN KEY ("juz_uci") REFERENCES "public"."juzs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ayah_texts" ADD CONSTRAINT "ayah_texts_ayah_uci_ayahs_uci_fk" FOREIGN KEY ("ayah_uci") REFERENCES "public"."ayahs"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ayah_texts" ADD CONSTRAINT "ayah_texts_edition_uci_editions_uci_fk" FOREIGN KEY ("edition_uci") REFERENCES "public"."editions"("uci") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ayahs_juz_idx" ON "ayahs" USING btree ("juz_uci");--> statement-breakpoint
CREATE INDEX "ayahs_hizb_idx" ON "ayahs" USING btree ("hizb_uci");--> statement-breakpoint
CREATE INDEX "ayahs_rub_idx" ON "ayahs" USING btree ("rub_uci");--> statement-breakpoint
CREATE INDEX "ayahs_ruku_idx" ON "ayahs" USING btree ("ruku_uci");--> statement-breakpoint
CREATE INDEX "ayahs_manzil_idx" ON "ayahs" USING btree ("manzil_uci");