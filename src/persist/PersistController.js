/** 
 * 
 *          TBD.
 * 
 * 
 * 

 
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
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

router.post('/persist', upload.any(), async function (req, res) {

    // This route makes a content be persistent in the Arweave Network.
    // To be developed.

    // 1. Get image or data.
    let imageBuffer = req.files[0].buffer;
    // 2. Instantiate transaction
    let transaction = await arweave.createTransaction({
        data: imageBuffer,
        quantity: arweave.ar.arToWinston('0.000000100011')
    }, jsonWallet);
    // 3. Asign proper content-type tag.
    transaction.addTag('Content-Type', req.files[0].mimetype);
    // 4. Sign transaction.
    await arweave.transactions.sign(transaction, jsonWallet, {saltLength: 10});
    // Submit transaction to the arweave network.
    let post = await arweave.transactions.post(transaction);
});
*/