const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const createTransport = require('./Transporter');
const findOrCreateInvitation = require('../invitation/InvitationController');
const {getEmailOptions_Join} = require('./utils');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/send-invite-email', async function (req, res) {

    let url = req.body.joinUrl
    let to = req.body.recipientEmail
    let collectionName = req.body.collectionName
    
    let transporter = createTransport()
    let invitation = await findOrCreateInvitation(req)
    let mailOptions = getEmailOptions_Join(to, collectionName, url, invitation.secret)

    transporter.sendMail(mailOptions, (error, info) => {
        if (error){res.status(200).send({success: false, error: error});}
        else {res.status(200).send({success: true})}
    });
});

module.exports = router;