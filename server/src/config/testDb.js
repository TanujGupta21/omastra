const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '2193',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    const res = await client.query('SELECT version()');
    console.log('PostgreSQL version:', res.rows[0].version);
    
    // Check if omastra db exists, if not create it
    const dbCheck = await client.query("SELECT 1 FROM pg_database WHERE datname = 'omastra'");
    if (dbCheck.rows.length === 0) {
      await client.query('CREATE DATABASE omastra');
      console.log('✅ Created database "omastra"');
    } else {
      console.log('✅ Database "omastra" already exists');
    }
    await client.end();
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

testConnection();
