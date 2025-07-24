"use client";

import { Spinner } from "@cmsgov/design-system";
import React, { useState } from "react";

const FormStep: React.FC = () => {
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);

  return (
    <div>
      {zipDownloadUrl && (
        <a href={zipDownloadUrl} download="filled_forms.zip">
          Download your forms
        </a>
      )}
      <Spinner />
    </div>
  );
};

export default FormStep;
