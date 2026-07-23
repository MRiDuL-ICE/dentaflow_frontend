import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DentaFlow - Your Complete Dental Solution",
  description: "Intelligent multi-tenant dental clinic management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
