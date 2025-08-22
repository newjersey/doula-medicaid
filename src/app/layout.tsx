import MenuBar from "@/app/form/(formSteps)/components/MenuBar";
import "@/app/globals.css";
import "@newjersey/njwds/dist/css/styles.css";
import njStateSeal from "@newjersey/njwds/dist/img/nj_state_seal.png";
import Head from "next/head";
import Image from "next/image";

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
        <div aria-label="Official government website">
          <div className="nj-banner">
            <div className="nj-banner__header">
              <div className="grid-container">
                <div className="nj-banner__inner">
                  <div>
                    <Image
                      className="nj-banner__header-seal"
                      src={njStateSeal}
                      alt="NJ flag"
                    ></Image>
                  </div>
                  <div className="grid-col-fill">
                    <a href="https://nj.gov">Official Site of the State of New Jersey</a>
                  </div>
                  <div className="grid-col-auto">
                    <div className="text-white">
                      <ul>
                        <li>Governor Phil Murphy &bull; Lt. Governor Tahesha Way</li>
                        <li>
                          <a href="https://nj.gov/subscribe/" target="_blank">
                            <svg
                              className="usa-icon nj-banner__mail-icon bottom-neg-2px margin-right-05"
                              aria-hidden="true"
                              focusable="false"
                              role="img"
                            >
                              <use href={"/svg/sprite.svg#mail"}></use>
                            </svg>
                            Get Updates
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <MenuBar />
        </div>

        <div className="usa-section">
          <div className="grid-container">{children}</div>
        </div>
      </body>
    </html>
  );
}
