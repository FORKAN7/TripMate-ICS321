import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

console.log("setup is running");

const caPath = path.resolve("ca.pem");
console.log("CA path:", caPath);
console.log("CA exists:", fs.existsSync(caPath));

const db = await mysql.createConnection({
  host: "mysql-39d25d81-for70600-bc95.d.aivencloud.com",
  port: 18486,
  user: "avnadmin",
  password: process.env.DB_PASSWORD,
  database: "defaultdb",
  ssl: {
    ca: fs.readFileSync(caPath),
    minVersion: "TLSv1.2",
    rejectUnauthorized: true
  }
});

console.log("connected ✅");

await db.query(`
CREATE TABLE IF NOT EXISTS REPORT (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

console.log("Table created ✅");

await db.end();