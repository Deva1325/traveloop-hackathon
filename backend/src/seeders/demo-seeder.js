const { sequelize, User, City } = require('../models');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    await sequelize.authenticate();
    const hash = await bcrypt.hash('password123', 10);
    
    await User.findOrCreate({
      where: { Email: 'demo@traveloop.com' },
      defaults: { FullName: 'Demo User', PasswordHash: hash }
    });
    
    await City.findOrCreate({
      where: { CityName: 'Paris' },
      defaults: { CountryName: 'France', CountryCode: 'FR' }
    });
    
    console.log('Seed executed successfully');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
seed();
