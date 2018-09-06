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
            // comme la méthode register est une promesse, on peut utiliser then() & catch()
            req.flash('success', 'Inscription réussie, vous pouvez maintenant vous connecter');
            // On peut set un message flash stockée dans req.flash(), qui apparaîtra suite à la redirection apres l'enregistrement du formulaire grâce au template master.pug qui vient écouter la session flash pour voir s'il y a des messages
            res.redirect('/');
        }).catch((err) => {
            // Si il y a une erreur, on vient fournir du contenu pour l'afficher via le render sur le template Register | err.errors = erreurs rencontrées; req.body = ce que l'on a récupéré du formulaire lors de la tentative d'enregistrement
            res.render("register.pug", {err: err.errors, user: req.body});
        });
    });
}