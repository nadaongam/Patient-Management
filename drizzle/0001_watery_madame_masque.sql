-- ALTER TYPE "gender" ADD VALUE 'MALE';--> statement-breakpoint
-- ALTER TYPE "gender" ADD VALUE 'FEMALE';--> statement-breakpoint
-- ALTER TYPE "gender" ADD VALUE 'OTHER';--> statement-breakpoint
-- ALTER TYPE "type" ADD VALUE 'FAMILY_BOOK';--> statement-breakpoint
-- ALTER TYPE "type" ADD VALUE 'ID_CARD';--> statement-breakpoint
-- ALTER TYPE "type" ADD VALUE 'DRIVER_LICENSE';--> statement-breakpoint
-- ALTER TYPE "type" ADD VALUE 'PASSPORT';--> statement-breakpoint
-- ALTER TYPE "status" ADD VALUE 'SCHEDULED';--> statement-breakpoint
-- ALTER TYPE "status" ADD VALUE 'PENDING';--> statement-breakpoint
-- ALTER TYPE "status" ADD VALUE 'CANCELLED';--> statement-breakpoint
-- ALTER TABLE "appointment" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "identify" DROP COLUMN IF EXISTS "name";