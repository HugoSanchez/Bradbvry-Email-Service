let User = require('./User');
let {encrypt} = require('../utils');

module.exports = findOrCreateUser = async (req) => {

    // We start by destructuring the req.body object and by
    // Encrypting everything that might be saved in the DB.
    let address = encrypt(req.body.address)
    let masterThreadID = encrypt(req.body.masterThreadID)
    let previewEntriesThreadID = encrypt(req.body.previewEntriesThreadID)

    // Execute query on MongoDB.
    let user = await User.findOne({address}).exec()

    // Check if an user
    // already exists.
    if (user) return user
    
    else {
        // If no instance exists,
        // we need to save the intance in the DB.
        let newuser = await User.create({

            address, 
            masterThreadID, 
            previewEntriesThreadID

        })

        return newuser
    }
}
