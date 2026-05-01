-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('IT', 'FR', 'AR', 'EN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MENTOR', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "DegreeType" AS ENUM ('TRIENNALE', 'MAGISTRALE', 'CICLO_UNICO', 'DOTTORATO', 'MASTER_I_LIVELLO', 'MASTER_II_LIVELLO', 'CORSO_SINGOLO');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('HOUSING', 'ADMINISTRATIVE', 'HEALTH', 'EDUCATION', 'EMPLOYMENT', 'FINANCE', 'LEGAL', 'TRANSPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "ResourcePointType" AS ENUM ('CARITAS', 'CPIA', 'CENTRO_IMPIEGO', 'ASL', 'QUESTURA', 'COMUNE', 'PATRONATO', 'ASSOCIATION', 'OTHER');

-- CreateEnum
CREATE TYPE "SubscriptionKind" AS ENUM ('SCHOLARSHIP_ALERT', 'SERVICE_UPDATE', 'HOUSING_ALERT', 'EVENT_REMINDER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED', 'FAILED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'REVIEWING', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('USER', 'SERVICE', 'RESOURCE_POINT', 'COMPARISON_SET');

-- CreateEnum
CREATE TYPE "JourneyStepCategory" AS ENUM ('PRE_DEPARTURE', 'ARRIVAL', 'ADMINISTRATIVE', 'HOUSING', 'EDUCATION', 'INTEGRATION');

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" CITEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "password_hash" TEXT,
    "name" TEXT,
    "image" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "avatar_url" TEXT,
    "preferred_locale" "Locale" NOT NULL DEFAULT 'IT',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "qr_code_token" UUID NOT NULL,
    "home_city_id" UUID,
    "accepted_terms_at" TIMESTAMP(3),
    "accepted_gdpr_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentor_profile" (
    "user_id" UUID NOT NULL,
    "headline" TEXT NOT NULL,
    "bio" TEXT,
    "languages" TEXT[],
    "expertise" TEXT[],
    "years_in_italy" INTEGER,
    "accepting_mentees" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentor_profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "kind" "SubscriptionKind" NOT NULL,
    "filters" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name_it" TEXT NOT NULL,
    "name_fr" TEXT,
    "region" TEXT NOT NULL,
    "province" TEXT,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "city_id" UUID NOT NULL,
    "website" TEXT,
    "email_admissions" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "qs_ranking_world" INTEGER,
    "founded_year" INTEGER,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_translation" (
    "university_id" UUID NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT,
    "description" TEXT,
    "admissions_url" TEXT,

    CONSTRAINT "university_translation_pkey" PRIMARY KEY ("university_id","locale")
);

-- CreateTable
CREATE TABLE "course" (
    "id" UUID NOT NULL,
    "university_id" UUID NOT NULL,
    "degree_type" "DegreeType" NOT NULL,
    "name_it" TEXT NOT NULL,
    "name_en" TEXT,
    "duration_years" INTEGER NOT NULL,
    "language" TEXT[],
    "tuition_eur_min" DECIMAL(10,2),
    "tuition_eur_max" DECIMAL(10,2),
    "website_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarship" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title_it" TEXT NOT NULL,
    "title_fr" TEXT,
    "provider" TEXT NOT NULL,
    "amountEur" DECIMAL(10,2),
    "deadline" TIMESTAMP(3),
    "apply_url" TEXT,
    "eligibility" JSONB NOT NULL,
    "description" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "icon_key" TEXT,
    "estimated_days" INTEGER,
    "cost_eur_min" DECIMAL(10,2),
    "cost_eur_max" DECIMAL(10,2),
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "price_eur" DECIMAL(10,2),
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "current_version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_translation" (
    "service_id" UUID NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body_md" TEXT NOT NULL,
    "documents" JSONB NOT NULL,
    "meta_keywords" TEXT,

    CONSTRAINT "service_translation_pkey" PRIMARY KEY ("service_id","locale")
);

-- CreateTable
CREATE TABLE "service_version" (
    "id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "editor_id" UUID,
    "snapshot" JSONB NOT NULL,
    "change_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_point" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ResourcePointType" NOT NULL,
    "city_id" UUID NOT NULL,
    "name_it" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DECIMAL(9,6) NOT NULL,
    "lng" DECIMAL(9,6) NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "opening_hours" JSONB,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_point_translation" (
    "resource_point_id" UUID NOT NULL,
    "locale" "Locale" NOT NULL,
    "description" TEXT NOT NULL,
    "services_note" TEXT,

    CONSTRAINT "resource_point_translation_pkey" PRIMARY KEY ("resource_point_id","locale")
);

-- CreateTable
CREATE TABLE "comparison_set" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comparison_set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_step" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "category" "JourneyStepCategory" NOT NULL,
    "order_index" INTEGER NOT NULL,
    "icon_key" TEXT,
    "is_optional" BOOLEAN NOT NULL DEFAULT false,
    "service_slug" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_step_translation" (
    "step_id" UUID NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "journey_step_translation_pkey" PRIMARY KEY ("step_id","locale")
);

-- CreateTable
CREATE TABLE "journey_progress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "step_id" UUID NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "amount_eur" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "provider_ref" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" UUID NOT NULL,
    "reporter_id" UUID NOT NULL,
    "target_type" "ReportTargetType" NOT NULL,
    "target_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UniversityScholarships" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ComparisonUniversities" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE INDEX "account_user_id_idx" ON "account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_provider_account_id_key" ON "account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_session_token_key" ON "session"("session_token");

-- CreateIndex
CREATE INDEX "session_user_id_idx" ON "session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_qr_code_token_key" ON "user"("qr_code_token");

-- CreateIndex
CREATE INDEX "user_role_status_idx" ON "user"("role", "status");

-- CreateIndex
CREATE INDEX "user_created_at_idx" ON "user"("created_at");

-- CreateIndex
CREATE INDEX "mentor_profile_accepting_mentees_idx" ON "mentor_profile"("accepting_mentees");

-- CreateIndex
CREATE INDEX "subscription_user_id_idx" ON "subscription"("user_id");

-- CreateIndex
CREATE INDEX "subscription_kind_is_active_idx" ON "subscription"("kind", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "city_slug_key" ON "city"("slug");

-- CreateIndex
CREATE INDEX "city_region_idx" ON "city"("region");

-- CreateIndex
CREATE INDEX "city_name_it_idx" ON "city" USING GIN ("name_it" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "university_slug_key" ON "university"("slug");

-- CreateIndex
CREATE INDEX "university_city_id_idx" ON "university"("city_id");

-- CreateIndex
CREATE INDEX "university_is_public_idx" ON "university"("is_public");

-- CreateIndex
CREATE INDEX "university_translation_name_idx" ON "university_translation" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "course_university_id_idx" ON "course"("university_id");

-- CreateIndex
CREATE INDEX "course_degree_type_idx" ON "course"("degree_type");

-- CreateIndex
CREATE INDEX "course_name_it_idx" ON "course" USING GIN ("name_it" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "scholarship_slug_key" ON "scholarship"("slug");

-- CreateIndex
CREATE INDEX "scholarship_deadline_idx" ON "scholarship"("deadline");

-- CreateIndex
CREATE INDEX "scholarship_is_published_idx" ON "scholarship"("is_published");

-- CreateIndex
CREATE INDEX "scholarship_title_it_idx" ON "scholarship" USING GIN ("title_it" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "service_slug_key" ON "service"("slug");

-- CreateIndex
CREATE INDEX "service_category_is_published_idx" ON "service"("category", "is_published");

-- CreateIndex
CREATE INDEX "service_is_premium_idx" ON "service"("is_premium");

-- CreateIndex
CREATE INDEX "service_translation_title_idx" ON "service_translation" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "service_version_editor_id_idx" ON "service_version"("editor_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_version_service_id_version_key" ON "service_version"("service_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "resource_point_slug_key" ON "resource_point"("slug");

-- CreateIndex
CREATE INDEX "resource_point_city_id_idx" ON "resource_point"("city_id");

-- CreateIndex
CREATE INDEX "resource_point_type_is_active_idx" ON "resource_point"("type", "is_active");

-- CreateIndex
CREATE INDEX "resource_point_name_it_idx" ON "resource_point" USING GIN ("name_it" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "comparison_set_user_id_idx" ON "comparison_set"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "journey_step_key_key" ON "journey_step"("key");

-- CreateIndex
CREATE INDEX "journey_step_category_order_index_idx" ON "journey_step"("category", "order_index");

-- CreateIndex
CREATE INDEX "journey_progress_user_id_completed_idx" ON "journey_progress"("user_id", "completed");

-- CreateIndex
CREATE INDEX "journey_progress_step_id_idx" ON "journey_progress"("step_id");

-- CreateIndex
CREATE UNIQUE INDEX "journey_progress_user_id_step_id_key" ON "journey_progress"("user_id", "step_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_provider_ref_key" ON "order"("provider_ref");

-- CreateIndex
CREATE INDEX "order_user_id_idx" ON "order"("user_id");

-- CreateIndex
CREATE INDEX "order_service_id_idx" ON "order"("service_id");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

-- CreateIndex
CREATE INDEX "report_target_type_target_id_idx" ON "report"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "report_status_idx" ON "report"("status");

-- CreateIndex
CREATE INDEX "report_reporter_id_idx" ON "report"("reporter_id");

-- CreateIndex
CREATE INDEX "audit_log_user_id_idx" ON "audit_log"("user_id");

-- CreateIndex
CREATE INDEX "audit_log_resource_resource_id_idx" ON "audit_log"("resource", "resource_id");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "_UniversityScholarships_AB_unique" ON "_UniversityScholarships"("A", "B");

-- CreateIndex
CREATE INDEX "_UniversityScholarships_B_index" ON "_UniversityScholarships"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ComparisonUniversities_AB_unique" ON "_ComparisonUniversities"("A", "B");

-- CreateIndex
CREATE INDEX "_ComparisonUniversities_B_index" ON "_ComparisonUniversities"("B");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_home_city_id_fkey" FOREIGN KEY ("home_city_id") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_profile" ADD CONSTRAINT "mentor_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university" ADD CONSTRAINT "university_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_translation" ADD CONSTRAINT "university_translation_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_translation" ADD CONSTRAINT "service_translation_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_version" ADD CONSTRAINT "service_version_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_version" ADD CONSTRAINT "service_version_editor_id_fkey" FOREIGN KEY ("editor_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_point" ADD CONSTRAINT "resource_point_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_point_translation" ADD CONSTRAINT "resource_point_translation_resource_point_id_fkey" FOREIGN KEY ("resource_point_id") REFERENCES "resource_point"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_set" ADD CONSTRAINT "comparison_set_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_step_translation" ADD CONSTRAINT "journey_step_translation_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "journey_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_progress" ADD CONSTRAINT "journey_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_progress" ADD CONSTRAINT "journey_progress_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "journey_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UniversityScholarships" ADD CONSTRAINT "_UniversityScholarships_A_fkey" FOREIGN KEY ("A") REFERENCES "scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UniversityScholarships" ADD CONSTRAINT "_UniversityScholarships_B_fkey" FOREIGN KEY ("B") REFERENCES "university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComparisonUniversities" ADD CONSTRAINT "_ComparisonUniversities_A_fkey" FOREIGN KEY ("A") REFERENCES "comparison_set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComparisonUniversities" ADD CONSTRAINT "_ComparisonUniversities_B_fkey" FOREIGN KEY ("B") REFERENCES "university"("id") ON DELETE CASCADE ON UPDATE CASCADE;
