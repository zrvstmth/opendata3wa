const express = require('express');

const app = express();

// Indiquer au script de se servir du dossier public (dans lequel il trouvera entre autre les styles)
app.use(express.static('public'));

// Indique que le système de vue est de type pub
app.set('view engine', 'pug');
    // Indique le chemin des vues
app.set('views', './views');

// Gestion des routes
app.get('/', function(req, res) {
    // res.setHeader('Content-Type', 'text/plain');
    res.render('index', {pseudo: "Tim", login: "/login", register: "/register"});
});

app.get('/login', function(req, res) {
    // res.setHeader('Content-Type', 'text/plain');
    res.render('login');
});

app.get('/register', function(req, res) {
    // res.setHeader('Content-Type', 'text/plain');
    res.render('register');
});



app.listen(8080, () => {
    console.log('Port 8080 | localhost:8080');
});