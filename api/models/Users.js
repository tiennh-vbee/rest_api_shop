const mongoose = require('mongoose');
const userSchema = mongoose.Schema;
mongoose.set('strictQuery', true); // remove DeprecationWarning

const UserSchema = new userSchema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    email: {
        type: String, 
        maxLength: 255, 
        unique: true, 
        required: true, 
    },
    password: {type: String, maxLength: 255, required: true},
});

module.exports = mongoose.model('User', UserSchema);