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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body>
        <div className="usa-section">
          <div className="grid-container">
            <div className="grid-row">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
