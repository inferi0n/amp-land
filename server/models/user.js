const mongoose  = require('mongoose');
const validator = require('validator');

let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Некорректный email: {VALUE}',
            isAsync: false
        }
    }
});

UserSchema.pre('save', function (next) {
    let user = this;

    user.name = validator.escape(user.name);
    user.email = validator.escape(user.email);

    next();
});

let User = mongoose.model('User', UserSchema);

module.exports = { User };