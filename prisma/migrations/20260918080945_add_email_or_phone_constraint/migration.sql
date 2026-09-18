-- AlterTable
ALTER TABLE "Borrower" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

ALTER TABLE "Borrower"
ADD CONSTRAINT "user_email_or_phone_check"
CHECK ("email" IS NOT NULL OR "phone" IS NOT NULL);
