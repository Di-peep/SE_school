const express = require('express');
const bodyParser = require('body-parser');
const Router = require('./Router.js');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use('/user', Router);


app.listen(PORT, function() {
    console.log("Сервер запущено на порту:", PORT);
})
