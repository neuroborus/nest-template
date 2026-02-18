-- DropIndex
DROP INDEX "auth_nonces_eth_address_idx";

-- DropIndex
DROP INDEX "auth_nonces_eth_address_key";

-- AlterTable
ALTER TABLE "auth_nonces"
  RENAME COLUMN "expired" TO "expires_at";

-- AlterTable
ALTER TABLE "auth_nonces"
  DROP COLUMN "eth_address",
  ADD COLUMN "used_at" TIMESTAMP(3),
  ADD COLUMN "used_by_address" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "auth_nonces_nonce_key" ON "auth_nonces"("nonce");

-- CreateIndex
CREATE INDEX "auth_nonces_expires_at_idx" ON "auth_nonces"("expires_at");
