const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { PrivateKey, ThreadID, Client} = require('@textile/hub');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get('/collections/:owner', async function (req, res) {

    console.time('set')
    let owner = req.params.owner
    let identity = await PrivateKey.fromString(process.env.TEXTILE_BV_ID)
    let client = await Client.withKeyInfo({key: process.env.TEXTILE_HUB_KEY})
    await client.getToken(identity)  
    let threads = await client.listThreads()

    console.log(threads)
    console.timeEnd('set')
});

module.exports = router;