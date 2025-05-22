// src/app/api/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(req: NextRequest) {
  try {
    const { item_id } = await req.json()

    if (!item_id) {
      return NextResponse.json({ error: 'Missing item_id' }, { status: 400 })
    }

    await db.query('DELETE FROM items WHERE item_id = $1', [item_id])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to delete item:', err)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
