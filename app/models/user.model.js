const mongoose = require('mongoose');
const hash = require('./../hash');
let Schema = mongoose.Schema;

// Schema mongoose
let userSchema = new Schema({
    firstname: {type: String, required: [true, 'Un prénom doit être renseigné']},
    lastname: {type: String, required: [true, 'Un nom doit être renseigné']},
    email : {
        type: String,
        validate: {
            validator: function(mailValue) {
                // c.f. http://emailregex.com/
                const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegExp.test(mailValue);
            },
            message: 'L\'adresse email {VALUE} n\'est pas une adresse RFC valide.'
        }
    },
    hash: {type: String},
    salt: {type: String},
    githubId: { type: String },
    avatarUrl: { type: String }
});

userSchema.statics.register = function(firstname, lastname, email, password, password_confirm){
    // Insertion en base de données Mongo via la méthode create(), methode qui renvoie une promesse.
    
    if(password === password_confirm) 
    {
        return hash(password).then(({salt, hash}) => {
            return this.create({
                'firstname' : firstname,
                'lastname': lastname,
                'email': email,
                'salt': salt,
                'hash': hash
            });
        });
    } else 
    {
        // console.log('Mot de passe différent');
        // Format erreur de mongoose -> err.errors.message
        return Promise.reject({ errors: [new Error('Le mot de passe n\'est pas identique')] })
    }

    // Code snippet
    // return this.findOne({ email: email })
    //     .then(user => {
    //         if (user)
    //             return Promise.reject(new Error(`Cette adresse email est déjà utilisée (${user.email})`));
    //     })
    //     .then(() => hash(pass))
    //     .then( ({salt, hash}) => {
    //     return this.create({
    //         firstname : firstname,
    //         lastname : lastname,
    //         email : email,
    //         salt : salt,
    //         hash : hash
    //     })
    // }).catch(err => {
    //     // Fabrication d'un tableau de messages d'erreur (extraits de l'objet 'ValidationError' renvoyé par Mongoose)
    //     if (err.errors)
    //         throw Object.keys(err.errors).map(field => err.errors[field].message);
        
    //     throw [err.message ? err.message : err];
    // })
};

userSchema.statics.verifyPass = function(passwordInClear, userObject) {
    const userSalt = userObject.salt;
    const userHash = userObject.hash;

    return hash(passwordInClear, userSalt).then((data) => {
        if (data.hash === userHash) 
        {
            return Promise.resolve(userObject);
        } else 
        {
            return Promise.reject(new Error('Mot de passe invalide'));
        }
    });
}

userSchema.statics.signupViaGithub = function(profile) {

    // Recherche si cet utilisateur (loggué via Github) n'est pas déjà dans notre base mongo ?
    return this.findOne({ 'githubId' : profile.id })
        .then(user => {
            // Non ! Donc on l'inscrit dans notre base..
            if (user === null) {
                if (!profile.displayName) {
                    profile.displayName = 
                        ['kiwi','orange','abricot','banane'][~~(Math.random()*4)] + " " + (~~(Math.random() * 999 - 100)+100);
                }
                const [firstname, lastname] = profile.displayName.split(' ');
                return this.create({
                    githubId : profile.id,
                    firstname : firstname || '',
                    lastname : lastname || '',
                    avatarUrl : profile.photos[0].value // Photo par défaut de l'user Github
                });
            }
            // On renvoie l'utilisateur final
            return user;
        });
}

module.exports = mongoose.model('User', userSchema);
// let model = mangoose.model('model', schema);