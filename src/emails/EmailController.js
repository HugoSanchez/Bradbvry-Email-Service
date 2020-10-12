const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');

const User = require('../user/User');
const {encrypt, decrypt} = require('../utils')
const createTransport = require('./Transporter')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/send-invite-email', async function (req, res) {

    let transporter = createTransport()
    let url = req.body.joinUrl
    let collectionName = req.body.collectionName
    let from = {name: 'Bradbvry', address: 'hugo@bradbvry.com'}

    let mailOptions = {
        from: from,
        to: req.body.recepientEmail,
        subject: `You've been invited to ${collectionName}`,
        html: `
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet">
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Hey there!</p> 
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">You've been invited to join <span style="font-weight: 600;"> ${collectionName}'s </span>collection on Bradbvry. Please do so using this link <a href=${url}>here.</a></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error){res.status(200).send({success: false});}
        else {res.status(200).send({success: true})}
    });
});


router.post('/add-invited-member', async function (req, res) {

    console.log(req.body)
    let url = req.body.acceptUrl
    let collectionName = req.body.collectionName
    let from = {name: 'Bradbvry', address: 'hugo@bradbvry.com'}

    let newMember = req.body.sender

    let userEncyptedAddress = encrypt(req.body.inviter)

    User.findOne({ethAddress: userEncyptedAddress}, async (err, user) => {
        if (err) { res.status(400).send({error: err})} 
        if (user) { 
            let userEmail = decrypt(user.email)
            console.log(userEmail)


            let transporter = createTransport()

            let mailOptions = {
                from: from,
                to: userEmail,
                subject: `Confirm new member to ${collectionName}`,
                html: `
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet">
                <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Great news!</p> 
                <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;"><span style="font-weight: 600;">${newMember}</span> has accepted your invitation to join 
                your collection <span style="font-weight: 600;">${collectionName}</span> on Bradbvry. In order for the content to be accessible, you should first confirm its membership. Please do so using this link <a href=${url}>here</a>.</p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error){res.status(200).send({success: false});}
                else {res.status(200).send({success: true})}
            });
        }
    });
});

module.exports = router;