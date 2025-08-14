"use client";

import {
  Header,
  MegaMenu,
  NavDropDownButton,
  NavMenuButton,
  PrimaryNav,
  Title,
} from "@trussworks/react-uswds";
import { useState } from "react";

const onToggle = (
  index: number,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean[]>>,
): void => {
  setIsOpen((prevIsOpen) => {
    const newIsOpen = [false, false];
    newIsOpen[index] = !prevIsOpen[index];
    return newIsOpen;
  });
};

const MenuBar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const onClick = (): void => setExpanded((prvExpanded) => !prvExpanded);
  const testItemsMegaOne = [
    [
      <a href="https://nj.gov/#one" target="_blank" key="one">
        Fake link one
      </a>,
      <a href="https://nj.gov/#two" target="_blank" key="two">
        Fake link two
      </a>,
    ],
    [
      <a href="https://nj.gov/#three" target="_blank" key="three">
        Fake link three
      </a>,
      <a href="https://nj.gov/#four" target="_blank" key="four">
        Fake link four
      </a>,
    ],
  ];
  const testItemsMegaTwo = [
    [
      <a href="https://nj.gov/#one" target="_blank" key="one">
        Fake link five
      </a>,
      <a href="https://nj.gov/#two" target="_blank" key="two">
        Fake link six
      </a>,
    ],
    [
      <a href="https://nj.gov/#three" target="_blank" key="three">
        Fake link seven
      </a>,
      <a href="https://nj.gov/#four" target="_blank" key="four">
        Fake link eight
      </a>,
    ],
  ];
  const [isOpen, setIsOpen] = useState([false, false]);
  const testItemsMegaMenu = [
    <>
      <NavDropDownButton
        onToggle={(): void => {
          onToggle(0, setIsOpen);
        }}
        menuId="testDropDownOne"
        isOpen={isOpen[0]}
        label="Placeholder 1"
        isCurrent={true}
      />
      <MegaMenu key="one" items={testItemsMegaOne} isOpen={isOpen[0]} id="testDropDownOne" />
    </>,
    <>
      <NavDropDownButton
        onToggle={(): void => {
          onToggle(1, setIsOpen);
        }}
        menuId="testDropDownTwo"
        isOpen={isOpen[1]}
        label="Placeholder 2"
      />
      <MegaMenu key="two" items={testItemsMegaTwo} isOpen={isOpen[1]} id="testDropDownTwo" />
    </>,
    <a href="https://nj.gov/#three" target="_blank" key="three" className="usa-nav__link">
      <span>Placeholder 3</span>
    </a>,
    <a href="https://nj.gov/#four" target="_blank" key="four" className="usa-nav__link">
      <span>Placeholder 4</span>
    </a>,
    <a href="https://nj.gov/#five" target="_blank" key="five" className="usa-nav__link">
      <span>Placeholder 5</span>
    </a>,
  ];
  return (
    <>
      <Header basic={true} basicWithMegaMenu={true} showMobileOverlay={expanded}>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>NJ Form Filler</Title>
            <NavMenuButton onClick={onClick} label="Menu" />
          </div>
          <PrimaryNav
            items={testItemsMegaMenu}
            mobileExpanded={expanded}
            onToggleMobileNav={onClick}
          ></PrimaryNav>
        </div>
      </Header>
    </>
  );
};

export default MenuBar;
