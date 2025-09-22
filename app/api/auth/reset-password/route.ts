import prisma from "@/lib/prismaConnect";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const {email} = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Missing Email" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: email},
    });
    if (!existingUser) {
        // dont tell them to that the email is not correct because of security
        console.log("User does not exist")
        // return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    return NextResponse.json({ message: "Password reset link sent to your email!" }, { status: 200 });
}