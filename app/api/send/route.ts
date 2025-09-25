import WelcomeEmail from "@/emails/WelcomeEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data } = await resend.emails.send({
            from: "Fortress Key <onboarding@resend.dev>",
            to: "emmanueldaliso3@gmail.com",
            subject: "Welcome to Fortress Key",
            react: WelcomeEmail({ username: "Emmd" }),
            text: "Welcome to Fortress Key",
        })
        return NextResponse.json({ data }, { status: 200 });

    } catch(error) {
        console.log("There was an error sending emil: ", error)
        return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
}
    