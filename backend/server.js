const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { env } = require('./src/config/env');

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const { sequelize } = require('./src/models');
    await sequelize.sync(); // Sync models with database (create tables if they don't exist)
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
