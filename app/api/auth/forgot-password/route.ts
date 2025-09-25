// app/api/auth/request-otp/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismaConnect"
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Avoid email enumeration: always return success even if user doesn't exist
      // return NextResponse.json({ success: true });
      console.log("Email not found")
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // save OTP
    await prisma.userOTP.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });
    console.log("OTP:", otp)

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    // TODO: send OTP via email/SMS here instead of returning it
    return NextResponse.json({ success: true, otp }); 
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
