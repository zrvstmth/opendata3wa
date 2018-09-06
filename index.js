require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');

// ///////////////////////////
// Indiquer au script de se servir du dossier public (dans lequel il trouvera entre autre les styles) --> middlewares
// Section de Middlewares
// ///////////////////////////
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
        extended: false
    })
);
app.use(session({
    secret: 'opendata3wa rocks',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);
// Démarrage de la session flash
app.use(flash());
    // Middleware maison qui vient stocker dans la variable flashMessages les cookies qui ont été stockés dans la session flash
app.use((req, res, next) => {
    app.locals.flashMessages = req.flash();
    next()
});

// Indique que le système de vue est de type pub
app.set('view engine', 'pug');
    // Indique le chemin des vues
app.set('views', './views');

const r = require('./app/routes');
r(app);

// MongoDB
const dbUser = process.env.MONGO_USER;
const password = encodeURIComponent(process.env.MONGO_PASS);
const host = process.env.MONGO_HOST;
const dbName = process.env.MONGO_DBNAME;
const port = process.env.MONGO_PORT;
mongoose.connect(`mongodb://${dbUser}:${password}@${host}:${port}/${dbName}`, {useNewUrlParser: true})
    .then(
        () => {
            const port = 8080;
            app.listen(port, () => {
                console.log(`Port ${port} | localhost:${port}`);
            });
    });
 