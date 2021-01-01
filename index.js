let db = require('./db');
var cors = require('cors')
let express = require('express')
let bodyParser = require('body-parser');
let findOrCreateUserMiddleware = require('./src/user/UserMiddleware')

let app = express();
let port = 1000;

// app.set('view engine', 'ejs');
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(findOrCreateUserMiddleware);

const EmailController = require('./src/emails/EmailController');
app.use('/api/share/', EmailController)

app.listen(port, function(req, res){
    console.log('Server is RUNNING at port: ', port);
});








