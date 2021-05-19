;global.WebSocket = require('isomorphic-ws')
require('dotenv').config();
let client = require('./client')
let db = require('./db');
let cors = require('cors')
let express = require('express')

let app = express();
let port = process.env.PORT || 3003;

app.use(cors())
app.use(express.json({limit: '5000mb'}));
app.use(express.urlencoded({limit: '5000mb'}));


const CollectionsController = require('./src/collections/CollectionsController');
app.use('/api/', CollectionsController)

const EmailController = require('./src/emails/EmailController');
app.use('/api/share/', EmailController)

const UserRoutes = require('./src/user/UserRoutes');
app.use('/api/user/', UserRoutes)

app.listen(port, function(req, res){
    console.log('Server is RUNNING at port: ', port);
})


const callClient = async () => {
    await client()
}

callClient()

