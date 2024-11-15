const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    image: String,
    productId: String,
    productTitle: String,
    description: String,
    price: String
})

const productd = mongoose.model('Product', productSchema)

module.exports = productd;