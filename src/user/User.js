var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  ethAddress: String, 
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');