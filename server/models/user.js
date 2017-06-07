const mongoose  = require('mongoose');
const validator = require('validator');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
        }
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = { User };