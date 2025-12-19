import type { Metadata } from "next";
import { Karla, EB_Garamond } from "next/font/google";
import "./globals.css";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Layered Home",
  description: "Thoughtful spaces, beautifully layered",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/wbu1ntp.css" />
      </head>
      <body className={`${karla.variable} ${ebGaramond.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
