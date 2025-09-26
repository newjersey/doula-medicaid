"use client";

import dynamic from "next/dynamic";

const ClientRoutes = dynamic(() => import("@/app/form/clientRoutes"), { ssr: false });

export default function Page() {
  return <ClientRoutes />;
}
