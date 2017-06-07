require('./config/config');

const express      = require('express');
const bodyParser   = require('body-parser');

const { mongoose } = require('./db/mongoose');

const app = express();
const port = process.env.PORT;

app.disable('x-powered-by');

app.set('views engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.render('index.amp.hbs');
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});