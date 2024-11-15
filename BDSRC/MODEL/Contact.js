const mongoose = require('mongoose')


const contectSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    contact: String,
    message: String,
})

const contactd = mongoose.model('Contact', contectSchema);

module.exports = contactd;