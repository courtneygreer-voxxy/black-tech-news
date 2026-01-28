import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db/client';

// POST /api/subscribers - Add a new email subscriber
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'website', referrer_url } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Get client info
    const userAgent = request.headers.get('user-agent') || null;
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip');

    // Check if email already exists
    const existingSubscriber = await pool.query(
      'SELECT id, status FROM email_subscribers WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existingSubscriber.rows.length > 0) {
      const subscriber = existingSubscriber.rows[0];

      if (subscriber.status === 'active') {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      }

      // Reactivate if previously unsubscribed
      if (subscriber.status === 'unsubscribed') {
        await pool.query(
          `UPDATE email_subscribers
           SET status = 'active',
               unsubscribed_at = NULL,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [subscriber.id]
        );

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
        });
      }
    }

    // Insert new subscriber
    const result = await pool.query(
      `INSERT INTO email_subscribers
       (email, status, source, referrer_url, ip_address, user_agent)
       VALUES ($1, 'active', $2, $3, $4, $5)
       RETURNING id, email`,
      [email.toLowerCase().trim(), source, referrer_url, ip, userAgent]
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the newsletter!',
      subscriber: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
