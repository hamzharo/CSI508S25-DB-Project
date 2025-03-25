import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// ✅ Debugging: Test connection
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
    process.exit(1); // Stop the server if DB connection fails
  } else {
    console.log("✅ MySQL Database Connected Successfully");
  }
});

export default db;
