import { Pool, PoolClient } from 'pg';

// Database configuration for Google Cloud SQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,

  // Google Cloud SQL specific settings
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to Google Cloud SQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Helper function to query the database
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res.rows;
}

// Helper function to get a client from the pool
export async function getClient(): Promise<PoolClient> {
  const client = await pool.connect();
  return client;
}

// Export the pool for direct access if needed
export default pool;
