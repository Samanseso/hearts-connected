import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My First Narraleaf App",
  description: "Your journey starts here",
  icons: {
    icon: '/favicon.ico',
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
          rel="preload"
          href="/char/narra.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/ui/game-dialog.png"
          as="image"
          type="image/png"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
