import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { clientEmail, pdfBlob } = await request.json();

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      // Add your email service configuration
    });

    // Send email
    await transporter.sendMail({
      from: 'Your Company <noreply@yourcompany.com>',
      to: clientEmail,
      subject: 'Your Investment Portfolio Report',
      text: 'Please find attached your investment portfolio report.',
      attachments: [
        {
          filename: 'investment_report.pdf',
          content: pdfBlob,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 