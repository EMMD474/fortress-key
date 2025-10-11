import prisma from "@/lib/prismaConnect";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, userName, email, currentPassword, newPassword } = await req.json();

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If password change is requested, verify current password
    if (newPassword && currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.masterHash);
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }
    }

    // Check if username is being changed and if it's already taken
    // if (userName && userName !== user.userName) {
    //   const existingUser = await prisma.user.findUnique({
    //     where: { userName }
    //   });
    //   if (existingUser) {
    //     return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    //   }
    // }

    // Prepare update data
    const updateData: any = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      userName: userName || user.userName,
      email: email || user.email,
    };

    // Hash new password if provided
    if (newPassword) {
      updateData.masterHash = await bcrypt.hash(newPassword, 10);
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
