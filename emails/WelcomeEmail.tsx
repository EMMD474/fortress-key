import * as React from "react";
import { Html, Head, Preview, Body, Container, Text } from "@react-email/components";

interface WelcomeEmailProps {
  username: string;
}

export default function WelcomeEmail({ username }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Fortress Key 🔐</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ margin: "40px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}>
          <Text style={{ fontSize: "20px", fontWeight: "bold" }}>Hi {username},</Text>
          <Text style={{ fontSize: "16px", marginTop: "16px" }}>
            Welcome to Fortress Key! 🔐 We're excited to have you on board and help you secure your passwords.
          </Text>
          <Text style={{ fontSize: "16px", marginTop: "12px" }}>
            Your account has been successfully created. You can now start managing your passwords securely.
          </Text>
          <Text style={{ fontSize: "14px", color: "#555", marginTop: "20px" }}>— The Fortress Key Team</Text>
        </Container>
      </Body>
    </Html>
  );
}
