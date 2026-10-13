require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 OMASTRA Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   API:    http://localhost:${PORT}/api/v1\n`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
});
