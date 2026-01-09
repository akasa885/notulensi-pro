import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { User } from "@/app/models";
import { verifyPassword, generateToken, setAuthCookie } from "@/app/lib/auth";
import { validateJsonRequest } from "@/app/lib/apiMiddleware";
import {
  checkRateLimit,
  getClientIp,
  resetRateLimit,
} from "@/app/lib/rateLimit";

export async function POST(request: NextRequest) {
  // Get client IP
  const clientIp = getClientIp(request);

  // Check rate limit (5 attempts per 15 minutes)
  const rateLimit = checkRateLimit(clientIp, 5, 15 * 60 * 1000, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    const retryAfterMinutes = Math.ceil(
      (rateLimit.resetTime - Date.now()) / 60000
    );
    return NextResponse.json(
      {
        success: false,
        error: `Too many login attempts. Please try again in ${retryAfterMinutes} minute(s).`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
          ),
        },
      }
    );
  }

  // Validate JSON request
  const validationError = validateJsonRequest(request);
  if (validationError) return validationError;

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      console.log(
        `❌ Failed login attempt from IP: ${clientIp} - Email: ${email} (${rateLimit.remaining} attempts remaining)`
      );
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      name: user.name,
    });

    // Set cookie
    await setAuthCookie(token);

    // Reset rate limit on successful login
    resetRateLimit(clientIp);
    console.log(`✅ Successful login from IP: ${clientIp} - Email: ${email}`);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to login" },
      { status: 500 }
    );
  }
}
