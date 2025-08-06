import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/database/prisma';

// Validation schema
const verifyOTPSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['registration', 'login', 'password_reset']).default('registration'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = verifyOTPSchema.parse(body);
    const { userId, otp, type } = validatedData;

    // Find the OTP code
    const otpCode = await prisma.oTPCode.findFirst({
      where: {
        userId,
        code: otp,
        type,
        used: false,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!otpCode) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.oTPCode.update({
      where: { id: otpCode.id },
      data: { used: true },
    });

    // Update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: {
        otpVerified: true,
        isEmailVerified: true,
      },
    });

    return NextResponse.json(
      {
        message: 'OTP verified successfully',
        user: {
          id: otpCode.user.id,
          email: otpCode.user.email,
          name: otpCode.user.name,
          isEmailVerified: true,
          otpVerified: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify OTP error:', error);

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

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 