const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.validatePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = model('User', userSchema);