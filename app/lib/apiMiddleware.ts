import { NextRequest, NextResponse } from "next/server";

/**
 * Validates that the request accepts JSON and has proper headers
 * This prevents direct browser access to API routes
 */
export function validateJsonRequest(request: NextRequest): NextResponse | null {
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  // Check if request is a POST, PUT, or PATCH with JSON content
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-Type must be application/json" },
        { status: 415 } // Unsupported Media Type
      );
    }
  }

  // Check if request accepts JSON response
  // This prevents direct browser navigation which typically accepts text/html
  if (
    accept &&
    !accept.includes("application/json") &&
    !accept.includes("*/*")
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "API only accepts requests with Accept: application/json",
      },
      { status: 406 } // Not Acceptable
    );
  }

  return null; // Valid request
}
