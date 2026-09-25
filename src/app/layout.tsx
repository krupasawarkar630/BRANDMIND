import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRANDMIND — Don't generate a brand. Stress-test it.",
  description: "BRANDMIND is an AI Brand Strategy Lab that transforms rough startup ideas into structured, differentiated, launch-ready brand systems. Interview, stress-test, and ship.",
  keywords: "brand strategy, AI branding, brand DNA, startup branding, brand positioning",
  openGraph: {
    title: "BRANDMIND — AI Brand Strategy Lab",
    description: "Don't generate a brand. Stress-test it.",
    type: "website",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
