let User = require('./User');
let {encrypt} = require('../utils')

module.exports = findOrCreateUserMiddleware = (req, res, next) => {

    if (req.body.email) {
        let email = encrypt(req.body.sender)
        let address = encrypt(req.body.senderAddress)
        
        User.findOne({email: email}, (err, user) => {
            if (err) { res.status(400).send({error: err})} 
            if (user) { next() }
            else { 
                User.create({email, ethAddress: address}, (err, user) => {
                if (err) { res.status(400).send({error: err})}
                else { next() }
            })}
        })
    } 
    else {
        next()
    }
}

