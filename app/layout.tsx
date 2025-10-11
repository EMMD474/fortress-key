import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/provider";
import NavBar from "@/components/navigation/NavBar";
import { SideNavProvider } from "@/context/SideNavContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fortress Key",
  description: "Secure your digital life with Fortress Key",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 tracking-tight`}
      >
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-black">
          <SideNavProvider>
           <Providers>
            <NavBar />
            <div>
              {children}
            </div>
          </Providers>
          </SideNavProvider>
        </div>
      </body>
    </html>
  );
}
