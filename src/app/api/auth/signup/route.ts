import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createJWT } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password, role } = body;

    // Validate input
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (name && typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Name must be a string" },
        { status: 400 }
      );
    }

    // Validate role if provided (default to USER)
    const validRoles = ["ADMIN", "USER", "EDITOR"];
    const userRole = role && validRoles.includes(role) ? role : "USER";

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await (prisma.user as any).create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        role: userRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate JWT token using the auth utility
    const token = createJWT(
      newUser.id,
      newUser.email,
      newUser.role as "ADMIN" | "USER" | "EDITOR"
    );

    // Create response with token in cookie
    const response = NextResponse.json(
      { success: true, data: newUser },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour to match JWT expiry
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
