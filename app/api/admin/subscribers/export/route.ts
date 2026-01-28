import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db/client';

// GET /api/admin/subscribers/export - Export subscribers as CSV
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query
    let query = 'SELECT email, status, source, subscribed_at, unsubscribed_at FROM email_subscribers WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = $1';
      params.push(status);
    }

    query += ' ORDER BY subscribed_at DESC';

    const result = await pool.query(query, params);

    // Generate CSV
    const headers = ['Email', 'Status', 'Source', 'Subscribed At', 'Unsubscribed At'];
    const csvRows = [headers.join(',')];

    result.rows.forEach((row) => {
      const values = [
        row.email,
        row.status,
        row.source,
        row.subscribed_at ? new Date(row.subscribed_at).toISOString() : '',
        row.unsubscribed_at ? new Date(row.unsubscribed_at).toISOString() : '',
      ];
      csvRows.push(values.map(v => `"${v}"`).join(','));
    });

    const csv = csvRows.join('\n');

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to export subscribers' },
      { status: 500 }
    );
  }
}
