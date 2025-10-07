"use client";

import dynamic from "next/dynamic";

const ClientRoutes = dynamic(() => import("@/app/clientRoutes"), { ssr: false });

export default function Page() {
  return <ClientRoutes />;
}
