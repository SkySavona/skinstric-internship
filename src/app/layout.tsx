import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.min.css";
import SessionToast from "./components/ui/SessionToast";

const roobertRegular = localFont({
  src: [
    {
      path: "/fonts/Roobert-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "/fonts/Roobert-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-roobert-regular",
});

const roobertSemiBold = localFont({
  src: [
    {
      path: "/fonts/Roobert-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "/fonts/Roobert-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-roobert-semibold",
});

export const metadata: Metadata = {
  title: "Skinstric | Sophisticated AI-Powered Custom Skincare",
  description:
    "Skinstric uses A.I. algorithms to find the best ingredients for your skin profile and formulates a routine just for you.",
  keywords:
    "custom skincare, AI-powered skincare, premium skincare, personalized skincare, sophisticated skincare, clinical diagnostics, customizable formulas",
  openGraph: {
    title: "Skinstric | AI-Powered Custom Skincare for Sophisticated Needs",
    description:
      "Experience the future of skincare with Skinstric's AI-generated custom formulas. Tailored for faces with sophisticated needs, backed by expert clinical diagnostics.",
    type: "website",
    url: "https://skinstric.com/",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "Skinstric Custom Skincare",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://skinstric-nine.vercel.app/img/favicon/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{ fontFamily: `"Roobert", sans-serif` }}
        className={`${roobertRegular.variable} ${roobertSemiBold.variable} antialiased`}
      >
        {children}
        <SessionToast />
      </body>
    </html>
  );
}
