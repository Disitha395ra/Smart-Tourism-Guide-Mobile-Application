const mongoose = require('mongoose');
const User = require('./models/User');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
    if (user) {
      console.log(`✅ Successfully made ${user.email} an admin!`);
    } else {
      console.log(`❌ User with email ${email} not found.`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
};

const targetEmail = process.argv[2] || 'test@test.com';
makeAdmin(targetEmail);
