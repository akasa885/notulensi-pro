import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { User } from "@/app/models";
import { hashPassword } from "@/app/lib/auth";

// POST: Create seeder data
export async function POST() {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");

    // Check if users already exist
    const existingUsers = await usersCollection.countDocuments();
    if (existingUsers > 0) {
      return NextResponse.json({
        success: false,
        message: "Users already exist. Seeder can only run once.",
      });
    }

    // Create demo users
    const demoUsers = [
      {
        name: "Rizki Akbar",
        email: "akasa2444@gmail.com",
        password: await hashPassword("@Home123"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: await hashPassword("@Home123"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await usersCollection.insertMany(demoUsers);

    return NextResponse.json({
      success: true,
      message: `Successfully created ${result.insertedCount} users`,
      users: Object.values(result.insertedIds).map((id) => id.toString()),
    });
  } catch (error) {
    console.error("Error seeding users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed users" },
      { status: 500 }
    );
  }
}
