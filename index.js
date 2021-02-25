;global.WebSocket = require('isomorphic-ws')

var cors = require('cors')
let express = require('express')
let findOrCreateUserMiddleware = require('./src/user/UserMiddleware');

let app = express();
let port = 1000;

app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(findOrCreateUserMiddleware);


const CollectionsController = require('./src/collections/CollectionsController');
app.use('/api/', CollectionsController)

const EmailController = require('./src/emails/EmailController');
app.use('/api/share/', EmailController)

app.listen(port, function(req, res){
    console.log('Server is RUNNING at port: ', port);
})


