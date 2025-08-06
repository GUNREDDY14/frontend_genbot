import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/database/prisma';
import { generateRandomString } from '@/utils';
import nodemailer from 'nodemailer';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);
    const { email } = validatedData;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = generateRandomString(32);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Save reset token
      await prisma.passwordResetToken.create({
        data: {
          email,
          token: resetToken,
          expires: expiresAt,
        },
      });

      // Send reset email
      try {
        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: 'Password Reset Request',
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #3b82f6;">Password Reset Request</h2>
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p>If you didn't request a password reset, you can ignore this email. Your password will remain unchanged.</p>
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>Best regards,<br>The GenBotAI Team</p>
            </div>
          `,
          text: `
            Password Reset Request
            
            Hello,
            
            We received a request to reset your password. Visit the following link to reset your password:
            
            ${resetUrl}
            
            If you didn't request a password reset, you can ignore this email. Your password will remain unchanged.
            
            This link will expire in 1 hour for security reasons.
            
            Best regards,
            The GenBotAI Team
          `,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue execution - don't expose email errors to client
      }
    }

    return NextResponse.json(
      {
        message: 'If an account with that email exists, we have sent a password reset link.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid email address',
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