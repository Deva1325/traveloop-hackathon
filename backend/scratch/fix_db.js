const { sequelize } = require('../src/models');

async function fixDB() {
  try {
    console.log('Resetting database schema...');
    await sequelize.sync({ force: true });
    console.log('Database reset successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDB();
