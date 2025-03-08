import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { ccEmail, pdfBytes } = await req.json();

    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false, // True for 465, false for other ports
    });

    // Send the email
    const mailOptions = {
      from: 'test@local.dev',
      to: ['submissions@mco.com', ccEmail],
      subject: 'Doula Medicare Application',
      text: 'Attached is a PDF application for being a Doula in this service.',
      attachments: [
        {
          filename: 'filled-form.pdf',
          content: Buffer.from(pdfBytes, 'base64'),
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
