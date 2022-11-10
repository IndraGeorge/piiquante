require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet')
const nocache = require("nocache")
const xss = require("xss");
const html = xss('<script>alert("xss");</script>');
console.log(html);

const sauceRoutes = require('./routes/sauces')
const userRoutes = require ('./routes/user')


// Création du serveur
const app = express();
const http = require("http")
const server = http.createServer(app)
server.listen(process.env.PORT||3000,() => console.log("Listening on port 3000"))

// Connexion à mongodb
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.${process.env.MONGODB_DATABASE_NAME}.mongodb.net/?retryWrites=true&w=majority`,
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

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(helmet())
app.use(nocache())

// Routes sauces
app.use('/api/sauces',sauceRoutes)
app.use('/api/auth',userRoutes)


module.exports = app;

