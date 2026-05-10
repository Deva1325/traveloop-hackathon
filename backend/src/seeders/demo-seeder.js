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
      where: { name: 'Paris' },
      defaults: { country: 'France', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' }
    });

    await City.findOrCreate({
      where: { name: 'London' },
      defaults: { country: 'United Kingdom', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' }
    });

    console.log('Seed executed successfully');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
seed();
