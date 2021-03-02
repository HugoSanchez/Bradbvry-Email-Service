const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const createTransport = require('./Transporter');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/send-invite-email', async function (req, res) {

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
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Regards :)</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error){res.status(200).send({success: false, error: error});}
        else {res.status(200).send({success: true})}
    });
});

module.exports = router;