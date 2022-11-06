const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require ('body-parser')
const path = require('path');

const sauceRoutes = require('./routes/sauces')
const userRoutes = require ('./routes/user')


// Création du serveur
const app = express();
const http = require("http")
const server = http.createServer(app)
server.listen(process.env.PORT||3000,() => console.log("Listening on port 3000"))

// Clé mongoDB
require('dotenv').config()
const token = process.env.TOKEN
const user = process.env.User


// Connexion à mongodb
mongoose.connect(`mongodb+srv://${user}:${token}@cluster0.hqsunjv.mongodb.net/?retryWrites=true&w=majority`,
    {

    }).then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
app.use(bodyParser.json());

app.use('/api/sauces',sauceRoutes)
app.use('/api/auth',userRoutes)
app.use('/api/auth',userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app;

