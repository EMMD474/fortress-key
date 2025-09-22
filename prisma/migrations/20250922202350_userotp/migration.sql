-- CreateTable
CREATE TABLE "public"."UserOTP" (
    "id" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserOTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserOTP_userId_idx" ON "public"."UserOTP"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserOTP" ADD CONSTRAINT "UserOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
