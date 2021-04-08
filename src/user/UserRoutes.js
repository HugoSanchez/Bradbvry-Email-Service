const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const findOrCreateUser = require('./UserController');
const cors = require('cors')


// Body parse the thing.
// This will be deprecated.
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Take content and upload that content into IPFS.
// All collections entries content is stored in IPFS via Fleek.
// Users wil have the option to make that content persistent in Arweave
// in the near future. This allows to de-duplicate things.
router.post('/create', cors(), async function (req, res) {

    let user = await findOrCreateUser(req)
    res.status(200).send({success: true, user})
    // catch(error){res.status(500).send({success: false, error})}

});

module.exports = router;