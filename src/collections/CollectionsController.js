const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const client = require('../../client')
const fleekStorage = require('@fleekhq/fleek-storage-js');
const {ThreadID,} = require('@textile/hub');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

let corsOptions = {
    origin: 'https://bradbvry.now.sh',
    optionsSuccessStatus: 200 // For legacy browser support
}

// Instantiate multer, 
// do not store file, just in memory.
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Body parse the thing.
// This will be deprecated.
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Take content and upload that content into IPFS.
// All collections entries content is stored in IPFS via Fleek.
// Users wil have the option to make that content persistent in Arweave
// in the near future. This allows to de-duplicate things.
router.post('/uploadToIpfs', upload.any(), async function (req, res) {

    let contentType = req.body.type
    let isImage = contentType.includes('image')

    let dataToUpload
    console.log(req.files)
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


// Get all collections from a given user by their
// Ethereum address. Returns collections array.
// This route is called when user is not logged in yet
// so that there could be public profiles. This is temporary.
router.get('/collections/:owner', cors() ,async function (req, res) {

    let owner = req.params.owner   
    let TexClient = await client()    
    let threadID = await ThreadID.fromString(process.env.GLOBAL_THREAD_ID)
    let rawCollections = await TexClient.find(threadID, 'public-collections', {})
    let collections = rawCollections.filter(collection => collection.owner.ethAddress === owner)

    res.status(200).send({success: true, collections})
});


// Get all entries from a specific collection. 
// It, gets all collections, filters to a specific collection,
// and retrrieves all entries from that collection.
// This is very ineficient and should be changed.
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

    res.status(200).send({success: true, entries, collection})
});

router.get('/collections/:owner/:collectionName/:itemId', async function (req, res) {

    let owner = req.params.owner
    let itemId = req.params.itemId
    let colName = req.params.collectionName 

    let TexClient = await client() 
    let threadID = await ThreadID.fromString(process.env.GLOBAL_THREAD_ID)
    let rawCollections = await TexClient.find(threadID, 'public-collections', {})
    let collection = rawCollections.filter(collection => 
        collection.owner.ethAddress === owner && collection.name === colName)

    let colID = await ThreadID.fromString(collection[0].threadId)
    let entries = await TexClient.find(colID, 'entries', {})
    let item = entries.filter(item => item._id === itemId)

    res.status(200).send({success: true, entries, collection, item})
});

router.post('/add/collections', async function (req, res) {



    let collection = req.body

    let TexClient = await client() 
    let threadID = await ThreadID.fromString(process.env.GLOBAL_THREAD_ID)    
    await TexClient.create(threadID, 'public-collections', [collection])

    res.status(200).send({success: true})
});

router.post('/delete/collections', async function (req, res) {

    let collectionID = req.body.id

    let TexClient = await client() 
    let threadID = await ThreadID.fromString(process.env.GLOBAL_THREAD_ID)    
    
    let rawCollections = await TexClient.find(threadID, 'public-collections', {})
    let collection = rawCollections.filter(collection => 
        collection.id === collectionID)
    
    if (collection[0]) {
        let _ID = collection[0]._id
        await TexClient.delete(threadID, 'public-collections', [_ID])
    }

    res.status(200).send({success: true})
});

router.get('/', async function (req, res) {

    res.status(200).send({success: true})

});

module.exports = router;