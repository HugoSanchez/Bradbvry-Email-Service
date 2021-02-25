const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');

const Invitation = require('../invitation/Invitation');
const {encrypt, decrypt} = require('../utils');
const createTransport = require('./Transporter');
const findOrCreateInvitation = require('../invitation/InvitationController');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/send-invite-email', async function (req, res) {

    console.log('   ----- 1 -----   ')

    //let invitation = await findOrCreateInvitation(req)
    // if (!invitation){res.status(500).send({success: false})}

    console.log('   ----- 2 -----   ')

    let transporter = createTransport()
    let url = req.body.joinUrl
    let collectionName = req.body.collectionName
    let from = {name: 'Bradbvry', address: 'hugo@bradbvry.com'}

    console.log('   ----- 3 -----   ')

    let mailOptions = {
        from: from,
        to: req.body.recipientEmail,
        subject: `You've been invited to ${collectionName}`,
        html: `
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet">
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Hey there!</p> 
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">You've been invited to join <span style="font-weight: 600;"> ${collectionName} </span>collection on Bradbvry. Please do so using this link <a href=${url}>here.</a></p>
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Here's the secret to join the collection: <span style="font-weight: 600;"> ${invitation.secret}</span></p>
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Regards :)</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error){res.status(200).send({success: false, error: error});}
        else {res.status(200).send({success: true})}
    });
});


router.post('/add-invited-member', async function (req, res) {

    let secret = req.body.secret
    let newMember = encrypt(req.body.sender)
    let userEncyptedAddress = encrypt(req.body.inviter)
    let collectionAddress = encrypt(req.body.collectionAddress)
     

    Invitation.findOne({

        secret: secret,
        recipientEmail: newMember,
        senderAddress: userEncyptedAddress,
        collectionAddress: collectionAddress

    }, async (err, invitation) => {
        if (err) { res.status(400).send({error: err})} 
        if (invitation) { 
            let details = decrypt(invitation.identityStr)
            res.status(200).send({success: true, details})

            // invitation.deleteOne(invitation)

        }
    });
});

module.exports = router;