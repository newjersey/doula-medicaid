// import "@uswds/uswds/css/uswds.min.css"
import "@newjersey/njwds/dist/css/styles.css";
import type { Metadata } from "next";
import Head from "next/head";
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
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>
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
