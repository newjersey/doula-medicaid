"use client";

import { SignatureMaker } from "@docuseal/signature-maker-react";
import { setKeyValue } from "@form/_utils/sessionStorage";

interface SignatureSectionProps {
  onSignatureChange?: (signature: string | null) => void;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ onSignatureChange }) => {
  const handleSignatureChange = (event: { base64: string | null }) => {
    setKeyValue("signature", event.base64 || "");
    onSignatureChange?.(event.base64);
  };

  return (
    <div className="maxw-tablet">
      <h2 className="font-heading-md">Signature</h2>
      <SignatureMaker withSubmit={false} onChange={handleSignatureChange} />
    </div>
  );
};

export default SignatureSection;
