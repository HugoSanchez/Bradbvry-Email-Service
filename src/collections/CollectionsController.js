const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const client = require('../../client')
const fleekStorage = require('@fleekhq/fleek-storage-js')
const {ThreadID,} = require('@textile/hub');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/uploadToIpfs', async function (req, res) {    

    let uploadedFile = await fleekStorage.upload({
        data: JSON.stringify(req.body),
        key: req.body.path,
        apiKey: process.env.FLEEK_API_KEY,
        apiSecret: process.env.FLEEK_API_SECRET,
    });

    let contentUrl = `https://ipfs.io/ipfs/${uploadedFile.hash}`
 
    res.status(200).send({success: true, contentUrl})
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