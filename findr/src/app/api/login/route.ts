// app/api/login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import crypto from 'crypto'

const pool = new Pool({
  user: 'jacq',
  host: 'localhost',
  database: 'findrdatabase',
  password: '',
  port: 5432,
})

// Simple no-salt SHA-256 hash function
function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const res = await pool.query('SELECT * FROM admins WHERE username = $1', [username])
    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Username not found' }, { status: 401 })
    }

    const user = res.rows[0]
    const hashedInputPassword = hashPassword(password)

    if (user.password !== hashedInputPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    return NextResponse.json({ message: 'Login successful' })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
