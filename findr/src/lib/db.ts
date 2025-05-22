// lib/db.ts
import { Pool } from 'pg';

export const db = new Pool({
  user: 'jacq',
  host: 'localhost',
  database: 'findrdatabase',
  password: '',
  port: 5432,
});
