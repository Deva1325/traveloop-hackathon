const { sequelize } = require('./src/config/db');

async function fixDatabase() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    // 1. Fix Users Table
    console.log('--- Checking Users table ---');
    const userTableInfo = await queryInterface.describeTable('Users');
    const userCols = [
      { name: 'ProfileImageUrl', type: 'NVARCHAR(500)', allowNull: true },
      { name: 'Bio', type: 'NVARCHAR(500)', allowNull: true },
      { name: 'Location', type: 'NVARCHAR(150)', allowNull: true },
      { name: 'Language', type: 'NVARCHAR(50)', defaultValue: "'English'" },
      { name: 'IsActive', type: 'BIT', defaultValue: 1 }, 
      { name: 'DeletedAt', type: 'DATETIMEOFFSET', allowNull: true }
    ];

    for (const col of userCols) {
      if (!userTableInfo[col.name]) {
        console.log(`Adding to Users: ${col.name}...`);
        await sequelize.query(`ALTER TABLE [Users] ADD [${col.name}] ${col.type} ${col.defaultValue !== undefined ? 'DEFAULT ' + col.defaultValue : ''} ${col.allowNull ? 'NULL' : 'NOT NULL'}`);
      }
    }

    // 2. Fix TripStops Table
    console.log('--- Checking TripStops table ---');
    const stopTableInfo = await queryInterface.describeTable('TripStops');
    
    if (!stopTableInfo['Nights']) {
      console.log('Adding Nights column to TripStops...');
      await sequelize.query('ALTER TABLE [TripStops] ADD [Nights] INT DEFAULT 1 NOT NULL');
    }

    if (!stopTableInfo['Activities']) {
      console.log('Adding Activities column to TripStops...');
      await sequelize.query('ALTER TABLE [TripStops] ADD [Activities] NVARCHAR(MAX) NULL');
    }

    console.log('--- Database fix complete! ---');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing database:', err);
    process.exit(1);
  }
}

fixDatabase();
