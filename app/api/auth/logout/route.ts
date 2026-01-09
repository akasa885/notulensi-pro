import { NextRequest, NextResponse } from "next/server";
import { removeAuthCookie } from "@/app/lib/auth";
import { validateJsonRequest } from "@/app/lib/apiMiddleware";

export async function POST(request: NextRequest) {
  // Validate JSON request
  const validationError = validateJsonRequest(request);
  if (validationError) return validationError;

  try {
    await removeAuthCookie();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to logout" },
      { status: 500 }
    );
  }
}
