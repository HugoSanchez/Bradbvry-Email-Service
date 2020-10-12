require('dotenv').config();

const mongoose = require('mongoose');

const db = process.env.DB_URL;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("open", function(ref) {
    console.log("\nConnected to mongo server.");
});
  
mongoose.connection.on("error", function(err) {
    console.log("Could not connect to mongo server!");
    return console.log(err);
});