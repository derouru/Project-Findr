import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      image,
      box_location,
      lost_at,
      description,
      found_when,
      finder_details,
      valid_code,
    } = body;

    // Check required fields
    if (!image || !box_location || !lost_at || !description || !found_when || !finder_details || !valid_code) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Check for duplicate valid_code
    const existing = await db.query(
      `SELECT COUNT(*) FROM items WHERE valid_code = $1`,
      [valid_code]
    );
    const count = parseInt(existing.rows[0].count, 10);

    if (count > 0) {
      return NextResponse.json({ error: 'Valid code already used. Please choose a different code.' }, { status: 400 });
    }

    // Insert new item
    await db.query(
      `INSERT INTO items (image, box_location, lost_at, description, found_when, finder_details, claimed, valid_code)
       VALUES ($1, $2, $3, $4, $5, $6, FALSE, $7)`,
      [image, box_location, lost_at, description, found_when, finder_details, valid_code]
    );

    return NextResponse.json({ message: 'Item successfully added!' });
  } catch (error: any) {
    console.error('[CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
