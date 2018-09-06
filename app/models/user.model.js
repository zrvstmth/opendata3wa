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
    githubId: {type: String}
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

module.exports = mongoose.model('User', userSchema);
// let model = mangoose.model('model', schema);