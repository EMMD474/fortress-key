-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "masterHash",
ADD COLUMN     "authHash" TEXT NOT NULL,
ADD COLUMN     "kdfParams" JSONB NOT NULL,
ADD COLUMN     "salt" BYTEA NOT NULL,
ADD COLUMN     "wrappedRecoveryKey" BYTEA NOT NULL,
ADD COLUMN     "wrappedRecoveryKeyIv" BYTEA NOT NULL,
ADD COLUMN     "wrappedRecoveryKeyTag" BYTEA NOT NULL,
ADD COLUMN     "wrappedVaultKey" BYTEA NOT NULL,
ADD COLUMN     "wrappedVaultKeyIv" BYTEA NOT NULL,
ADD COLUMN     "wrappedVaultKeyTag" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "public"."Credential" ADD COLUMN     "tag" BYTEA NOT NULL;

-- CreateIndex
CREATE INDEX "Credential_userId_idx" ON "public"."Credential"("userId");

-- CreateIndex
CREATE INDEX "Credential_categoryId_idx" ON "public"."Credential"("categoryId");

