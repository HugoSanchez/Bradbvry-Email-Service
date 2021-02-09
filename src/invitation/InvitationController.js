let Invitation = require('./Invitation');
let {encrypt} = require('../utils');
let { v4: uuidv4 } = require('uuid');

module.exports = findOrCreateInvitation = async (req) => {

    // We start we destructuring the req.body object and by
    // Encrypting everything that might be saved in the DB.
    let acknowledged = true
    let createdAt = Date.now() 
    let senderEmail = encrypt(req.body.sender)
    let senderAddress = encrypt(req.body.senderAddress)
    let collectionName = encrypt(req.body.collectionName)
    let collectionAddress = encrypt(req.body.collectionAddress)
    let collectionInfo = encrypt(req.body.collectionInfo)
    let recipientEmail = encrypt(req.body.recipientEmail)

    // Execute query on MongoDB.
    let invitation = await Invitation.findOne({

        senderAddress, 
        collectionAddress, 
        recipientEmail

    })
        .exec()

    // Check if an invitation
    // already exists.
    if (invitation) {
        // Check if this invitation whas acknowledged by the recepient.
        // If so, the user is sending again the same invitation to the same
        // recipient, we update the acknowledge status and return the instance 
        if (invitation.acknowledged === true) {
            invitation.acknowledged = false
            invitation.save()
            return invitation
        } else {
            // If not, just return the instance.
            return invitation
        }

    } else {
        // If no instance exists, it is the first invitation
        // and we need to save the intance in the DB.
        let secret = uuidv4()
        let newInvitation = await Invitation.create({

            senderEmail,
            acknowledged,
            createdAt,
            // identityStr,
            senderAddress,
            collectionName,
            collectionAddress,
            collectionInfo,
            recipientEmail,
            secret

        })

        return newInvitation
    }
}
