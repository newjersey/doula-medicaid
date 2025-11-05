"use client";

import dynamic from "next/dynamic";

const ClientRoutes = dynamic(() => import("@/app/form/ClientRoutes"), { ssr: false });

export default function Page() {
  return <ClientRoutes />;
}
