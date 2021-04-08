let mongoose = require('mongoose'); 

let UserSchema = new mongoose.Schema({  
  address: String,
  masterThreadID: String,
  previewEntriesThreadID: String, 
});

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');