require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Indiquer au script de se servir du dossier public (dans lequel il trouvera entre autre les styles) --> middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
        extended: false
    })
);

// Indique que le système de vue est de type pub
app.set('view engine', 'pug');
    // Indique le chemin des vues
app.set('views', './views');

const r = require('./app/routes');
r(app);

// MongoDB
const dbUser = process.env.MONGO_USER;
const password = process.env.MONGO_PASS;
const host = process.env.MONGO_HOST;
const dbName = process.env.MONGO_DBNAME;
const port = process.env.MONGO_PORT;
mongoose.connect(`mongodb://${dbUser}:${password}@${host}:${port}/${dbName}`, {useNewUrlParser: true})
    .then(
        () => {
            app.listen(8080, () => {
                console.log('Port 8080 | localhost:8080');
            });
    });
 