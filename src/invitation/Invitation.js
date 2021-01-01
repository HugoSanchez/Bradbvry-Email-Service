var mongoose = require('mongoose');  
var InvitationSchema = new mongoose.Schema({  
  collectionName: String,
  collectionAddress: String,
  senderAddress: String, 
  recipientEmail: String,
  acknowledged: Boolean,
  createdAt: Number
});

mongoose.model('Invitation', InvitationSchema);

module.exports = mongoose.model('Invitation');