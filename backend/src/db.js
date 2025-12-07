import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Required for Supabase
});

// Simple test
db.connect()
  .then(() => console.log("🟢 Connected to Supabase database"))
  .catch(err => console.error("🔴 Database connection error:", err));
