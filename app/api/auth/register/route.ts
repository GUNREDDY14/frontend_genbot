import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/database/prisma';

// Validation schema
const registerSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    const { userId, name, password } = validatedData;

    // Check if user exists and is OTP verified
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        otpCodes: {
          where: {
            type: 'registration',
            used: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!existingUser.otpVerified) {
      return NextResponse.json(
        { error: 'Email verification required. Please verify your email with OTP first.' },
        { status: 400 }
      );
    }

    // Check if user already has a password (already registered)
    if (existingUser.password) {
      return NextResponse.json(
        { error: 'User is already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user with name and password
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isEmailVerified: true,
        otpVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}