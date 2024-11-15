const { default: mongoose } = require("mongoose");
require('dotenv').config(); 

// //Database connection
const dbUri = process.env.MONGO_URI;

mongoose.connect(dbUri, {
    ssl: true  
})
  
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
module.exports = mongoose.connection;