import { BASE_PATH } from "@/app/basePath";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import WipBanner from "@/app/form/(formSteps)/welcome/WipBanner";
import ClientRoutes from "@/app/form/ClientRoutes";
import "@/app/globals.css";
import "@newjersey/njwds/dist/css/styles.css";
// import njStateSeal from "@newjersey/njwds/dist/img/nj_state_seal.png";

const RootLayout = () => {
  return (
    <>
      {" "}
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <header className="nj-banner" aria-label="Official government website">
        <div className="nj-banner__header">
          <div className="grid-container">
            <div className="nj-banner__inner">
              <div>
                {/* <Image className="nj-banner__header-seal" src={njStateSeal} alt="NJ flag"></Image> */}
              </div>
              <div className="grid-col-fill">
                <a href="https://nj.gov" target="_blank" rel="noopener">
                  <span className="usa-sr-only">opens in a new tab.</span>
                  Official Site of the State of New Jersey
                </a>
              </div>
              <div className="grid-col-auto">
                <div className="text-white">
                  <ul>
                    <li>
                      <a href="https://nj.gov/governor/" target="_blank" rel="noopener">
                        Governor Phil Murphy &bull; Lt. Governor Tahesha Way
                      </a>
                    </li>
                    <li>
                      <a href="https://nj.gov/subscribe/" target="_blank" rel="noopener">
                        <svg
                          className="usa-icon nj-banner__mail-icon bottom-neg-2px margin-right-05"
                          aria-hidden="true"
                          focusable="false"
                          role="img"
                        >
                          <use href={`${BASE_PATH}/img/sprite.svg#mail`}></use>
                        </svg>
                        <span className="usa-sr-only">opens in a new tab.</span>
                        Get Updates
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main id="main-content">
        {import.meta.env.NEXT_PUBLIC_FLAG_WEBSITE_UNAVAILABLE !== "1" && <WipBanner />}
        <div className="usa-section">
          <div className="grid-container">{<ClientRoutes />}</div>
        </div>
      </main>
      <HorizontalDivider />
      {/* <Footer
        size="slim"
        primary={null}
        secondary={
          <Logo
            size="slim"
            image={
              "hi"
              // <Image
              //   src={`${BASE_PATH}/img/DHS_logo.svg`}
              //   width={210}
              //   height={107}
              //   alt="DHS logo"
              // />
            }
            heading={
              <div className="grid-row flex-align-center">
                <div className="tablet:grid-col-auto tablet:border-right tablet:margin-right-2 tablet:padding-right-2">
                  <a href="mailto:mahs.doulaguide@dhs.nj.gov" target="_blank" rel="noopener">
                    <svg
                      className="usa-icon bottom-neg-05 margin-right-05 footer__mail-icon"
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                    >
                      <use href={`${BASE_PATH}/img/sprite.svg#mail`}></use>
                    </svg>
                    mahs.doulaguide@dhs.nj.gov
                  </a>{" "}
                  for assistance
                </div>
                <div className="tablet:grid-col-auto">
                  <a
                    href="https://www.nj.gov/nj/privacy.shtml"
                    target="_blank"
                    rel="noopener"
                    className="usa-link"
                  >
                    <span className="usa-sr-only">opens in a new tab.</span>
                    Privacy Policy
                  </a>
                </div>
              </div>
            }
          />
        }
      /> */}
    </>
  );
};

export default RootLayout;
