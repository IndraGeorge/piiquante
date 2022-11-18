const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')
const nocache = require("nocache")
const mongoSanitize = require('express-mongo-sanitize')
const bodyParser = require('body-parser')
const {xss} = require('express-xss-sanitizer')

// Déclaration des constantes pour les routes sauce et utilisateur
const sauceRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')


require('dotenv').config()
// Connexion à mongodb
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.${process.env.MONGODB_DATABASE_NAME}.mongodb.net/?retryWrites=true&w=majority`,
    {

    }).then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// Déclaration de la variable express
const app = express()

// Supprime le cache navigateur
app.use(nocache())


// Sécurise les en-têtes http
app.use(helmet({
    crossOriginResourcePolicy: false,
}))


// Nettoie les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB.
app.use(mongoSanitize())


// En-têtes htpp
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Analyse le corps de la requête
app.use(bodyParser.json({limit:'1kb'}));
app.use(bodyParser.urlencoded({extended: true, limit:'1kb'}));

// Empêche les injections xss
app.use(xss())


// Sauvegarde des images en local
app.use('/images', express.static(path.join(__dirname, 'images')))


// Routes sauces
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)


module.exports = app;

