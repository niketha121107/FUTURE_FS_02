const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    const existing = await Admin.findOne({ username: 'admin' });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Minicrm@2026', salt);
      await Admin.create({ username: 'admin', password: hashedPassword });
      console.log('Default admin created: admin / Minicrm@2026');
    } else {
      console.log('Default admin already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedAdmin();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
