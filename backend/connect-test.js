const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const uri = process.env.MONGO_URI;
console.log('Using URI:', uri);
mongoose.connect(uri, { connectTimeoutMS: 10000, serverSelectionTimeoutMS: 10000 })
  .then(() => { console.log('Connected OK'); process.exit(0); })
  .catch(err => { console.error('CONNECT ERROR:', err && err.message ? err.message : err); process.exit(1); });
