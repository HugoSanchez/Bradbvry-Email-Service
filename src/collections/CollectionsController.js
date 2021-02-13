const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const client = require('../../client')
const fleekStorage = require('@fleekhq/fleek-storage-js');
const {ThreadID,} = require('@textile/hub');
const multer  = require('multer');
const Arweave = require('arweave');
const jsonWallet = require('../../arweave-key-6nJ1p8ZcUvclj5AVQixhm-zJm838wSfMCgCk6_wiwnE.json')

const arweave = Arweave.init({
    host: "arweave.net",
    protocol: "https",
    port: 443,
    logging: false,
    timeout: 15000,
});


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/uploadToIpfs', upload.any(), async function (req, res) {

    let files = req.files
    console.log('re: ', req.files)
    console.log('re type: ', typeof req.files)

    var imageBuffer = req.files[0].buffer;
    var imageName = 'public/images/map.png';
    
    // let x = fs.createReadStream(imageBuffer);
    let dataToSend = {name: 'something', lastname: 'something else'}

    let transaction = await arweave.createTransaction({
        data: imageBuffer,
        quantity: arweave.ar.arToWinston('0.000000100011')
    }, jsonWallet);

    transaction.addTag('Content-Type', req.files[0].mimetype);
    // Now we sign the transaction
    await arweave.transactions.sign(transaction, jsonWallet, {saltLength: 10});

    // After is signed, we send the transaction
   let post = await arweave.transactions.post(transaction);
    console.log('Post: ?', post)

    console.log('TX: ', transaction)
    
    /**
    let uploadedFile = await fleekStorage.upload({
        data: req.files[0].buffer,
        key: '00009',
        apiKey: process.env.FLEEK_API_KEY,
        apiSecret: process.env.FLEEK_API_SECRET,
    });

    console.log('Here')
    */

    res.status(200).send({success: true, jsonWallet})
});

router.get('/collections/:owner', async function (req, res) {

    let owner = req.params.owner   
    let TexClient = await client()    
    let threadID = await ThreadID.fromString(process.env.GLOBAL_THREAD_ID)
    let rawCollections = await TexClient.find(threadID, 'public-collections', {})
    let collections = rawCollections.filter(collection => collection.owner.ethAddress === owner)

    res.status(200).send({success: true, collections})
});

router.get('/collections/:owner/:collectionName', async function (req, res) {

    let owner = req.params.owner
    let colName = req.params.collectionName 

    let TexClient = await client() 
    let threadID = await ThreadID.fromString(process.env.GLOBAL_THREAD_ID)
    let rawCollections = await TexClient.find(threadID, 'public-collections', {})
    let collection = rawCollections.filter(collection => 
        collection.owner.ethAddress === owner && collection.name === colName)

    let colID = await ThreadID.fromString(collection[0].threadId)
    let entries = await TexClient.find(colID, 'entries', {})
    res.status(200).send({success: true, entries})
});

module.exports = router;