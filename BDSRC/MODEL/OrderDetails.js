const mongoose = require('mongoose');

// Define the schema for the product order
const productOrderSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true, 
    },
    productTitle: {
        type: String,
        required: true, 
    },
    price: {
        type: Number,
        required: true, 
    },
    productImage: {
        type: String,
        required: true, 
    },
    fullname: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true, 
    },
    address: {
        type: String,
        required: true, 
    },
    landmark: {
        type: String,
        required: false, 
    }
}, { timestamps: true }); 


const ProductOrder = mongoose.model('ProductOrder', productOrderSchema);

module.exports = ProductOrder;
