const express = require('express')
const app = express()
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authentication = require('./routers/authentication')(router);
const blog = require('./routers/blogs')(router);


const config = require('./config/database');

mongoose.Promise = global.Promise;

mongoose.connect(config.uri,(err) => {
    if(err){
        console.log('Counld not connect to database : ', err)
    }else{
        console.log('Connected to datatbase ', config.db)
    }
});

app.use(cors({origin : "http://localhost:4200"}));
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(express.static(__dirname +'/client/dist'));

 
app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/client/dist/index.html')));
app.use('/authentication',authentication);
app.use('/blogs',blog);

app.listen(3000, () => console.log('Example app listening on port 3000!'))