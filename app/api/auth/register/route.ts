import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { User } from "@/app/models";
import { hashPassword, generateToken, setAuthCookie } from "@/app/lib/auth";
import { validateJsonRequest } from "@/app/lib/apiMiddleware";

export async function POST(request: NextRequest) {
  // Block registration in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: "Registration is disabled in production" },
      { status: 403 }
    );
  }

  // Validate JSON request
  const validationError = validateJsonRequest(request);
  if (validationError) return validationError;

  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Generate token
    const token = generateToken({
      userId: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register" },
      { status: 500 }
    );
  }
}
