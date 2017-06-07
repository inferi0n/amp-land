require('./server/config/config');

const express      = require('express');
const bodyParser   = require('body-parser');

const { mongoose } = require('./server/db/mongoose');

const app = express();
const port = process.env.PORT;

app.disable('x-powered-by');

app.set('views engine', 'hbs');
app.use(express.static(__dirname + '/public'));

console.log(__dirname);

app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.render('index.amp.hbs');
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});