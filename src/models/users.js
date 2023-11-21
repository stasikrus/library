const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {Ttype: String, required: true}
});

userSchema.methods.validatePassword = function(candidatePassword) {
    return candidatePassword === this.password;
}

module.exports = model('User', userSchema);