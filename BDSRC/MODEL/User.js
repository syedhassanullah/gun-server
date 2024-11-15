const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    email: String,
    password: String,

});


// UserSchema.pre('save', async function(next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

const User = mongoose.model("USER", UserSchema);


module.exports = User;