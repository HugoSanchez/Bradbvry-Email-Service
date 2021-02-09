let mongoose = require('mongoose');  

let InvitationSchema = new mongoose.Schema({  
  collectionName: String,
  collectionAddress: String,
  senderEmail: String,
  senderAddress: String, 
  recipientEmail: String,
  collectionInfo: String,
  acknowledged: Boolean,
  createdAt: Number,
  secret: String,
});

mongoose.model('Invitation', InvitationSchema);

module.exports = mongoose.model('Invitation');