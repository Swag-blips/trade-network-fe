import type { Metadata } from "next";
import { Fraunces, Inter, Rethink_Sans } from "next/font/google";
import { ToastProvider } from "@repo/ui/toast";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-rethink-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trade Network — Lender",
  description: "Fund verified trade across regional supply chains.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${rethinkSans.variable}`}
    >
      <body>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
