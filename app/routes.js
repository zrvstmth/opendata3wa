const User = require('./models/user.model');

module.exports = function(app, passport) {

    // Ce petit middleware met à disposition des variables pour toutes les 'views' Pug de l'application
	app.use((req, res, next) => {
    	app.locals.user = req.user; // Récupération de l'objet 'user' (sera existant si une session est ouverte, et undefined dans le cas contraire)
        next()
    })

    // Gestion des routes
    app.get('/', function(req, res) {
        res.render('index', {pseudo: "Tim"});
    });

    app.get('/login', function(req, res) {
        res.render('login');
    });
    // Une stratégie passport est une façon de s'identifier avec un provider quel qu'il soit (FB, TWT, GIT)
    // Lorsqu'on tente de se connecter, c'est le middleware de passport qui prend la main, avec la stratégie "locale" (configurée dans ./passport.js )
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        badRequestMessage: 'Identifiants non valides!',
        failureFlash: true,
        successFlash: {message: 'Connexion réussie. Bienvenue !'}
    }));
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', {
    	successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: { message: 'Connexion réussie avec Github. Bienvenue !' }
    }));

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

    app.get('/logout', function(req, res){
        req.session.destroy();
        req.logout();
        // res.send("logged out", 401);
        res.redirect('/');
    });
}