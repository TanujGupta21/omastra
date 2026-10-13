const { pool } = require('../models/pgAdapter');

const connectDB = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT current_database(), version()');
    client.release();
    console.log(`🐘 PostgreSQL connected: ${res.rows[0].current_database} (port ${process.env.PG_PORT || 5432})`);
    return pool;
  } catch (error) {
    console.error(`\n⚠️  PostgreSQL connection error: ${error.message}`);
    console.error(`   Check PG credentials in server/.env.\n`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
