const mongoose = require("mongoose");
mongoose.connect("mongodb://Srinidhi2005:Srinidhi2005@ac-zsqllp6-shard-00-00.l3mkfuz.mongodb.net:27017,ac-zsqllp6-shard-00-01.l3mkfuz.mongodb.net:27017,ac-zsqllp6-shard-00-02.l3mkfuz.mongodb.net:27017/?ssl=true&replicaSet=atlas-pkkmrj-shard-0&authSource=admin&appName=Cluster0")
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });
  