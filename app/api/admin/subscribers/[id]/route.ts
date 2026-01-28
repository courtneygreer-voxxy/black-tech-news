import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db/client';

// DELETE /api/admin/subscribers/[id] - Delete a subscriber
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await pool.query(
      'DELETE FROM email_subscribers WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/subscribers/[id] - Update subscriber status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['active', 'unsubscribed', 'bounced'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be active, unsubscribed, or bounced' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE email_subscribers
       SET status = $1,
           unsubscribed_at = CASE WHEN $1 = 'unsubscribed' THEN CURRENT_TIMESTAMP ELSE NULL END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, email, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriber: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}
