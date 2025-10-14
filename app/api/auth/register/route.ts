import prisma from "@/lib/prismaConnect"
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import WelcomeEmail from "@/emails/WelcomeEmail";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, userName, email, password } = await req.json();
  
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
  
    const existingUser = await prisma.user.findUnique({
      where: { email: email},
    });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await prisma.user.create({
      data: { 
        firstName,
        lastName: lastName || null,
        userName,
        email, 
        masterHash: hashedPassword }
    });
    
    // Send welcome email
    // const emailResult = await sendWelcomeEmail(email, name || email);
    // if (!emailResult.ok) {
    //   console.error("Failed to send welcome email:", emailResult.error);
      
    // }
    
    return NextResponse.json({ message: "User created" }, { status: 201 });

  } catch(error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const sendWelcomeEmail = async (email: string, username: string) => {
  return await sendEmail({
    to: email,
    subject: "Welcome to Fortress Key",
    react: WelcomeEmail({ username }),
    text: `Hi ${username}, Welcome to Fortress Key! Thanks for signing up and taking your first step in securing your passwords.`,
  });
}
