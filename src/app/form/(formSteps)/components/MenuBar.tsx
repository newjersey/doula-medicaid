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
    [<a key="one">Simple link one</a>, <a key="two">Simple link two</a>],
    [<a key="three">Simple link three</a>, <a key="four">Simple link four</a>],
  ];
  const testItemsMegaTwo = [
    [<a key="one">Simple link five</a>, <a key="two">Simple link six</a>],
    [<a key="three">Simple link seven</a>, <a key="four">Simple link eight</a>],
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
    <a key="three" className="usa-nav__link">
      <span>Placeholder 3</span>
    </a>,
    <a key="four" className="usa-nav__link">
      <span>Placeholder 4</span>
    </a>,
    <a key="five" className="usa-nav__link">
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
