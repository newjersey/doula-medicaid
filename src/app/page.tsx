"use client";

import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div>
      <h1>Doula Common Application</h1>
      <h2>Effortless paperwork management starts here</h2>
      <p className="usa-intro">
        Focus on care, not paperwork. The doula form filler streamlines your workflow, reducing
        duplicate effort. Effortlessly convert your Fee for Service application to your preferred
        MCO applications.
      </p>
      <a className="usa-button usa-button--big" href="form/personal-information">
        Start now
      </a>
    </div>
  );
};

export default LandingPage;
