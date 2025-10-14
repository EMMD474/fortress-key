import { NextRequest, NextResponse as res } from 'next/server';
import prisma from '@/lib/prismaConnect';
import generatePassword from '@/lib/generatePassword';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { length } = body;
        let password = ''

        if (length) {
            password = await generatePassword(length)
        }

        password = generatePassword();
        return res.json({ "Password": password}, { status: 200 });

    } catch (error) {
        console.log("THere was an error generating password!:", error);
        res.json(
            { error: `Failed to Generate Password!`},
            { status: 500 }
        );
    }
}