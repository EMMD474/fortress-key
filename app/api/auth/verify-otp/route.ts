import prisma from "@/lib/prismaConnect"
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const record = await prisma.userOTP.findFirst({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ success: false, message: "OTP expired or not found" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(otp, record.otpHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    await prisma.userOTP.update({
      where: { id: record.id },
      data: { used: true },
    });

    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

