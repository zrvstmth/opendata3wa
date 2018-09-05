const User = require('./models/user.model');

module.exports = function(app) {
    // Gestion des routes
    app.get('/', function(req, res) {
        res.render('index', {pseudo: "Tim"});
    });

    app.get('/login', function(req, res) {
        res.render('login');
    });

    app.get('/register', function(req, res) {
        res.render('register');
    });
    app.post('/register', function(req, res) {
        console.log(req.body);
        //On vient utiliser la méthode register du user.model (promesse)
        User.register(
            req.body.firstname,
            req.body.lastname,
            req.body.mail,
            req.body.password,
            req.body.password_confirm
        ).then(() => {
            res.redirect('/?register=ok');
        }).catch((err) => {
            res.render("register.pug", {err: err.errors, user: req.body})    
        });
    });
}