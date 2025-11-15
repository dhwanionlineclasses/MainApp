import type { Metadata } from "next";
import { inter, hankenGrotesk, geistSans, geistMono } from "@/app/fonts/font";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import ClientLayout from "./client-layout";
import Script from "next/script"; 

export const metadata: Metadata = {
  title: "Wah Tabla - Learn Music Online from Experts",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen w-full flex flex-col bg-background text-black font-hankenGrotesk antialiased",
          hankenGrotesk.variable,
          inter.variable,
          geistSans.variable,
          geistMono.variable
        )}
      >
        <Providers>
          {/* 🔽 Wrap all client logic inside a client layout */}
          <ClientLayout>{children}</ClientLayout>
        </Providers>
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
      </body>
    </html>
  );
}
