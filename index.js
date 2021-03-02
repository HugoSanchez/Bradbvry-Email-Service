;global.WebSocket = require('isomorphic-ws')
require('dotenv').config();

let cors = require('cors')
let express = require('express')

let app = express();
let port = 1000;

let corsOptions = {
    origin: 'https://bradbvry.now.sh',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions))
app.use(express.json({limit: '5000mb'}));
app.use(express.urlencoded({limit: '5000mb'}));


const CollectionsController = require('./src/collections/CollectionsController');
app.use('/api/', CollectionsController)

const EmailController = require('./src/emails/EmailController');
app.use('/api/share/', EmailController)

app.listen(port, function(req, res){
    console.log('Server is RUNNING at port: ', port);
})


