const express = require('express')
const mongoose = require('mongoose')

const app = express();
app.use(express.json())

// Clé mongoDB
require('dotenv').config()
const token = process.env.TOKEN
const user = process.env.User

// Connexion a mongodb
mongoose.connect(`mongodb+srv://${user}:${token}@cluster0.hqsunjv.mongodb.net/?retryWrites=true&w=majority`,
    {

    }).then(() => console.log('Connexion à MongoDB réussie !'))
      .catch(() => console.log('Connexion à MongoDB échouée !'));


const port = 3000;

// Point d'accès
app.get('/api/sauces/:id', (req, res) => {
    const id = req.params.id
    res.send(`voici la sauce ${id}`)

})


app.listen(port)
module.exports = app;

/*{
    useNewUrlParser: true,
    useUnifiedTopology: true
})*/