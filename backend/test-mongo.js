const mongoose = require('mongoose');

const uri = "mongodb://disithar_db_user:20020104@ac-bv1yzz8-shard-00-00.aqs61kv.mongodb.net:27017,ac-bv1yzz8-shard-00-01.aqs61kv.mongodb.net:27017,ac-bv1yzz8-shard-00-02.aqs61kv.mongodb.net:27017/?ssl=true&replicaSet=atlas-13d8d5-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Successfully connected via direct replica set string!");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Connection failed:", err);
    process.exit(1);
  });
