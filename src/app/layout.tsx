import "@uswds/uswds/css/uswds.min.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doula Common App",
  description: "Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
