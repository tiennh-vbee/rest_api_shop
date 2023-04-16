const mongoose = require('mongoose');
const orderSchema = mongoose.Schema;
mongoose.set('strictQuery', true); // remove DeprecationWarning

const OrderSchema = new orderSchema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, default: 1},
});

module.exports = mongoose.model('Order', OrderSchema);