import prisma from "@/lib/prismaConnect";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const {email, newPassword} = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Missing Email" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: email},
    });
    if (!existingUser) {
        // dont tell them to that the email is not correct because of security
        console.log("User does not exist")
        return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    const masterHash = await bcrypt.hash(newPassword, 10)

    // update the user's password
    try {
        await prisma.user.update({
            where: { email: email },
            data: { masterHash: masterHash }
        })
        return NextResponse.json({ message: "Password reset successfully!" }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
    }

    return NextResponse.json({ message: "Password reset link sent to your email!" }, { status: 200 });
}