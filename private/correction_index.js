// FICHIER ./index.js
// ------------------------------------------------------------------

require('dotenv').config() // Charge les variables d'environnement contenue dans le fichier ".env"
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

// Création d'une application express
const app = express()


app.set('view engine', 'pug') // Indique à Express que le moteur de templating à utiliser est "pug"
app.set('views', './views') // Indique à Express que le dossiers contenant les templates est "./views"

/**
 * Configuration des middlewares de l'application
 */

app.use(express.static('public')) // Middleware pour les fichiers statiques : http://expressjs.com/fr/starter/static-files.html
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
    secret: 'opendata3wa rocks',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(flash())
app.use((req, res, next) => {
    // Middleware perso
    app.locals.flashMessages = req.flash()
    next()
})
app.use(passport.initialize())
app.use(passport.session())

/**
 * Configuration des routes de l'application
 */

require('./app/passport')(passport);
require('./app/routes')(app, passport)

// Connexion à la base de données, et ensuite (then) on démarre le serveur
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`, { useNewUrlParser: true })
    .then(() => {

        // Démarrage du serveur (uniquement après que la conexion à la BDD soit établie) sur "http://localhost:1337"
        app.listen(1337, 'localhost', () => {
            console.log(`Le serveur a démarré sur http://localhost:1337/`)
        })

    })

