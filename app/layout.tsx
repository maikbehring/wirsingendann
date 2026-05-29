import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wirsingendann.de — Angels war erst der Anfang",
  description:
    "100 Follower geschafft — Angels gesungen. Nächstes Ziel: 250 Follower, dann Band im Maschinenraum-Stream.",
  openGraph: {
    title: "wirsingendann.de",
    description:
      "Road to 250 — Band-Auftritt im nächsten Stream nach Head in the Cloud.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
