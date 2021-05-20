const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const client = require('../../client')
const fleekStorage = require('@fleekhq/fleek-storage-js');
const {ThreadID} = require('@textile/hub');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const {encrypt, decrypt} = require('../utils');
const User = require('../user/User');
const Invitation = require('../invitation/Invitation');
const createTransport = require('../emails/Transporter');
const {getEmailOptions_Confirm} = require('../emails/utils');

const cors = require('cors');
const options = {
    origin: process.env.DEV ? '*' : "https://www.bradbvry.xyz/",
    allowedHeaders: ['Content-Type', 'Authorization']
}

// Instantiate multer, 
// do not store file, just in memory.
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Body parse the thing.
// This will be deprecated.
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('/uploadToIpfs', cors(options), upload.any(), async function (req, res) {
    // Take content and upload that content into IPFS.
    // All collections entries content is stored in IPFS via Fleek.
    // Users wil have the option to make that content persistent in Arweave
    // in the near future. This allows to de-duplicate things.
    let contentType = req.body.type
    let isImage = contentType.includes('image') || contentType.includes('video')

    let dataToUpload
    if (isImage) {dataToUpload = req.files[0].buffer}
    else {dataToUpload = JSON.stringify(req.body.entry)}

    let uploadedFile = await fleekStorage.upload({
        data: dataToUpload,
        key: uuidv4(),
        apiKey: process.env.FLEEK_API_KEY,
        apiSecret: process.env.FLEEK_API_SECRET,
    });

    let hash = uploadedFile.hash
    let contentURI = `https://ipfs.fleek.co/ipfs/${hash}`;
    res.status(200).send({success: true, contentURI})
});



router.get('/collections/:address', cors(options), async function (req, res) {
    // Get all collections from a given user by their
    // Ethereum address. Returns collections array.
    // This route is called when user is not logged in yet
    // so that there could be public profiles. This is temporary.
    let TexClient = await client()  
    let address = encrypt(req.params.address)
    let user = await User.findOne({address}).exec()
    let masterThreadID = decrypt(user.masterThreadID)
    let previewEntriesThreadID = decrypt(user.previewEntriesThreadID)

    
    let threadID = await ThreadID.fromString(masterThreadID)
    let collections = await TexClient.find(threadID, 'collections-list', {})

    let threadIDii = await ThreadID.fromString(previewEntriesThreadID)
    let previewEntries = await TexClient.find(threadIDii, 'preview-entries', {})

    res.status(200).send({success: true, collections, previewEntries})
});



router.get('/collections/:owner/:threadID', cors(options), async function (req, res) {
    // Get all entries from a specific collection. 
    // It, gets all collections, filters to a specific collection,
    // and retrrieves all entries from that collection.
    let collectionID = req.params.threadID 

    let TexClient = await client() 
    let threadID = await ThreadID.fromString(collectionID)
    let entries = await TexClient.find(threadID, 'entries', {})
    let collection = await TexClient.find(threadID, 'config', {})

    res.status(200).send({success: true, entries, collection})
});

router.get('/collections/:owner/:threadID/:itemId', cors(options), async function (req, res) {

    let TexClient = await client() 
    let threadID = await ThreadID.fromString(req.params.threadID)
    let entries = await TexClient.find(threadID, 'entries', {})
    let collection = await TexClient.find(threadID, 'config', {})
    let item = entries.filter(item => item._id === req.params.itemId)

    res.status(200).send({success: true, entries, collection, item})
});

router.post('/follow', cors(options), async function (req, res) {
    let TexClient = await client() 
    let threadID = await ThreadID.fromString(req.body.threadID)    
    await TexClient.create(threadID, 'followers', [req.body.follower])
    res.status(200).send({success: true})
});

router.post('/unfollow', cors(options), async function (req, res) {
    let TexClient = await client() 
    let threadID = await ThreadID.fromString(req.body.threadID)    
    await TexClient.delete(threadID, 'followers', [req.body.followID, "01f1jq27vqm5882exebk23jx0s"])
    res.status(200).send({success: true})
});

router.post('/add-invited-member', cors(options), async function (req, res) {
    let secret = req.body.secret
    let senderAddress = encrypt(req.body.inviter)
    let recipientEmail = encrypt(req.body.acceptantEmail)
    let collectionAddress = encrypt(req.body.collectionAddress)

    let invite = await Invitation.findOne({

        secret,
        senderAddress,
        recipientEmail,
        collectionAddress
    
    })

        .exec()


    if (!!invite) {

        let TexClient = await client() 
        let threadID = await ThreadID.fromString(req.body.collectionAddress)
        let collection = await TexClient.find(threadID, 'config', {})
        let keyOwners =  collection[0].keyOwners

        let newOwner = {
            memberId: req.body.acceptantID,
            memberAddress: req.body.acceptantEthAddress,
            memberPubkey: req.body.acceptantPubkey,
            collectionKey: '',
            acknowledged: false
        }

        let includes = keyOwners.filter(ko => ko.memberAddress === req.body.acceptantEthAddress)

        if (!includes[0]) {
            keyOwners.push(newOwner)
            collection.keyOwners = keyOwners
            await TexClient.save(threadID, 'config', collection)

            let to = decrypt(invite.senderEmail)
            let recepient = decrypt(invite.recipientEmail)
            let collectionName = decrypt(invite.collectionName)
            let collectionAddress = decrypt(invite.collectionAddress)
            let address = decrypt(invite.senderAddress)
            let url = `www.bradbvry.xyz/app/${address}/${collectionAddress}`
            await sendConfirmEmail(to, recepient, collectionName, url)
            res.status(200).send({success: true})
            console.log('there')
        }
        else {
            res.status(200).send({success: false, message: 'Key owner already exists'}) 
        }
    } else {
        res.status(200).send({success: false, message: 'Something wrong - could not find invite'})  
    }
});

const sendConfirmEmail = async (to, recepient, collectionName, url, res) => {

    let transporter = createTransport()
    let mailOptions = getEmailOptions_Confirm(to, recepient, collectionName, url)

    transporter.sendMail(mailOptions, (error, info) => {
        if (error){res.status(200).send({success: false, error: error});}
        else {console.log('success')}
    });
}


router.get('/', async function (req, res) {
    res.status(200).send({success: true})
});

module.exports = router;