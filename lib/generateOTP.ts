import prisma from "@/lib/prismaConnect"
import bcrypt from "bcryptjs";

export async function generateOTP(userId: string) {
  // generate random 6-digit code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // hash the OTP before storing
  const otpHash = await bcrypt.hash(otp, 10);

  // expire in 5 minutes
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.userOTP.create({
    data: {
      otpHash,
      expiresAt,
      userId,
    },
  });

  return otp; // return plain OTP so you can send via email/SMS
}
