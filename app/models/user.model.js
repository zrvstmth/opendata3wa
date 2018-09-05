const mongoose = require('mongoose');
const hash = require('./../hash');
let Schema = mongoose.Schema;

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
    hash: {type: String, required: true},
    salt: {type: String, required: true}
});

userSchema.statics.register = function(firstname, lastname, email, password, password_confirm){
    // Insertion en base de données Mongo via la méthode create(), methode qui renvoie une promesse.
    return hash(password).then(({salt, hash}) => {
        return this.create({
            'firstname' : firstname,
            'lastname': lastname,
            'email': email,
            'salt': salt,
            'hash': hash
        });
    });
};

module.exports = mongoose.model('User', userSchema);
// let model = mangoose.model('model', schema);