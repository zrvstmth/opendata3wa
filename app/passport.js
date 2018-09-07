const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const User = require('./models/user.model');

module.exports = function(passport) {
    // Stratégie locale
    const localStrategyConfig = {
        usernameField: 'mail', // en fonction du name="" du champs input type text
        passwordFIeld: 'password' // en fonction du name="" du champs input type password
    }
    
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(
        new LocalStrategy(localStrategyConfig, (email, password, done) => {
            // On vérifie ici les identifiants de notre utilisateur
        
        /*
        	Si ils sont bons, on redonne la main à "passport" avec cette ligne :
        
        		done(null, user);
                
            En cas de problème, on redonnera la main à "passport" avec :
            
            	done(null, false, {message: err.message});
        */
            User.findOne({email: email})
                .then((user) => {
                    if(!user)
                    {
                        // Invocation du handler done() de `passport` à la manière d'une erreur --> le middleware `passport.authenticate` répondra avec une erreur
                        done(null, false, {message: 'Adresse email invalide!'});
                        return Promise.reject() // fait également échouer notre chaîne de Promesses JS
                    }
                    return user;
                })
                .then(user => User.verifyPass(password, user))
                .then(user => {
                // Si on est arrivé jusqu'ici sans erreur, c'est que les identifiants semblent valides.
                // ---> Fin de l'authentification, on transmet l'objet 'user' à la méthode done() de passport, et le middleware `passport.authenticate` répondra avec une nouvelle session user
                    done(null, user);
                })
                .catch( (err) => {
                    if(err)
                    {
                        done(null, false, {message: err.message});
                    }
                });
        })
    );

    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CONSUMER_KEY,
        clientSecret: process.env.GITHUB_CONSUMER_SECRET,
        callbackURL: `http://${process.env.SERVER_NAME}:${process.env.SERVER_PORT}/auth/github/callback`
    },
        function(token, tokenSecret, profile, cb) {
            // User.findOrCreate({githubId: profile.id}, function(err, user) {
            //     return cb(err, user);
            // });
            User.signupViaGithub(profile)
                .then((user) => {
                    cb(null, user)
                })
                .catch((err) => {
                    cb(err, false);
                });
        }
    ));
}