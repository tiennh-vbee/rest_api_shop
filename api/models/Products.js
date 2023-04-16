const mongoose = require('mongoose');
const productSchema = mongoose.Schema;
mongoose.set('strictQuery', true); // remove DeprecationWarning

const ProductSchema = new productSchema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, maxLength: 255, required: true},
    price: {type: Number, maxLength: 255, required: true},
    productImage: {type: String, maxLength: 255},
});

module.exports = mongoose.model('Product', ProductSchema);