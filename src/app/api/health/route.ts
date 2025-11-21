import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const healthCheck = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      featureFlags: { NEXT_PUBLIC_FLAG_TEST: process.env.NEXT_PUBLIC_FLAG_TEST },
    };

    console.log(process.env.NEXT_PUBLIC_FLAG_TEST);
    return NextResponse.json(healthCheck, { status: 200 });
  } catch {
    const errorResponse = {
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
};
