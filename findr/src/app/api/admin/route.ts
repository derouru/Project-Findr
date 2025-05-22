import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: 'jacq',
  host: 'localhost',
  database: 'findrdatabase',
  password: '',
  port: 5432,
})

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY item_id DESC')
    const items = result.rows
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
