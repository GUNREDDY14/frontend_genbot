import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/database/prisma';
import { isValidEmail } from '@/utils';

// Validation schema
const sendOTPSchema = z.object({
  email: z.string().email('Invalid email address'),
  type: z.enum(['registration', 'login', 'password_reset']).default('registration'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = sendOTPSchema.parse(body);
    const { email, type } = validatedData;

    // Additional email validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user exists (for registration, user should NOT exist)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (type === 'registration' && existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    if (type !== 'registration' && !existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (10 minutes from now)
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // For registration, we'll create a temporary user record
    let userId: string;
    
    if (type === 'registration') {
      // Create a temporary user record for registration
      const tempUser = await prisma.user.create({
        data: {
          email,
          isEmailVerified: false,
          otpVerified: false,
        },
      });
      userId = tempUser.id;
    } else {
      userId = existingUser!.id;
    }

    // Delete any existing unused OTP codes for this user and type
    await prisma.oTPCode.deleteMany({
      where: {
        userId,
        type,
        used: false,
      },
    });

    // Create new OTP code
    await prisma.oTPCode.create({
      data: {
        userId,
        email,
        code: otp,
        type,
        expires,
      },
    });

    // In a real application, you would send this OTP via email
    // For development purposes, we'll return it in the response
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`OTP for ${email}: ${otp}`);
    }

    return NextResponse.json(
      {
        message: 'OTP sent successfully',
        userId,
        // Only include OTP in development
        ...(process.env.NODE_ENV === 'development' && { otp }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send OTP error:', error);

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