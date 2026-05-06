import db from './config/db.js'; // التأكد من المسار الصحيح

async function check() {
    try {
        // استخدمي db.query وليس pool.query
        const [rows] = await db.query('SELECT 1 + 1 AS result'); 
        console.log("✅ Database Connected! Result:", rows[0].result);
        process.exit();
    } catch (err) {
        console.error("❌ Connection Failed:", err.message);
        process.exit(1);
    }
}
check();