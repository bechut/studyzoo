/*
  Warnings:

  - The values [SIGN_UP] on the enum `OTP_TYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OTP_TYPE_new" AS ENUM ('LOGIN', 'ACCESS_TOKEN', 'FORGOT_PASSWORD');
ALTER TABLE "Otp" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Otp" ALTER COLUMN "type" TYPE "OTP_TYPE_new" USING ("type"::text::"OTP_TYPE_new");
ALTER TYPE "OTP_TYPE" RENAME TO "OTP_TYPE_old";
ALTER TYPE "OTP_TYPE_new" RENAME TO "OTP_TYPE";
DROP TYPE "OTP_TYPE_old";
ALTER TABLE "Otp" ALTER COLUMN "type" SET DEFAULT 'LOGIN';
COMMIT;

-- AlterTable
ALTER TABLE "Otp" ALTER COLUMN "type" SET DEFAULT 'LOGIN';
