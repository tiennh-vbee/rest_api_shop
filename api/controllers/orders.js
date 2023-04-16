const Order = require('../models/Orders');
const Product = require('../models/Products');
const mongoose = require('mongoose');

module.exports.orders_get_all = (req, res) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name price') // property name reference
        .exec()
        .then((ords) => {
            res.json({
                count: ords.length,
                orders: ords.map(ord => {
                    return {
                        _id: ord._id,
                        product: ord.product,
                        quantity: ord.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + ord._id,
                        }
                    } 
                })});
        })
        .catch((err) => {
            res.json({error: err});
        });
};

module.exports.orders_create_order = (req, res) => {
    const id = req.body.productId;
    Product.findById(id)
        .then((product) => {
            // xay ra khi ID cung length khac value => product null
            if(!product){
                return res.status(404).json({
                    message: 'Product not found',
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
            });
            return order.save(); // tra ve 1 promise nen se nhay xuong 'then' o dong duoi
        })
        .then((result) => {
            res.json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id,
                }});
        })
        // xay ra khi ID khac length => error
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

module.exports.orders_get_order = (req, res) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('_id product quantity')
        .populate('product')
        .exec()
        .then((ord) => {
            if(!ord){
                // xay ra khi ID cung length nhung khac value
                res.status(404).json({message: 'Oder not found!!!'});
            }
            res.status(200).json({
                order: ord,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + ord._id,
                }
            });
        })
        // xay ra khi ID khac length
        .catch((err) => {
            res.json({error: err});
        });
};

module.exports.orders_delete_order = (req, res) => {
    const id = req.params.orderId;
    Order.remove({_id: id})
        .exec()
        .then((result) => {
            // res.redirect('/products');
            res.json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/' + id,
                    body: {
                        name: 'String',
                        price: 'Number',
                    },
                },
            });            
        })
        .catch((err) => {
            res.status(500).json({error: err});
        });
};

module.exports.orders_edit_order = (req, res) => {
    const id = req.params.orderId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    // example with a patch request in raw json form
    // [
    //     {
    //         "propName": "quantity", "value": 100
    //     }
    // ]

    Order.update({_id: id}, {$set: updateOps})
        .exec()
        .then((result) => {
            // res.redirect('/orders');
            res.json({
                message: 'Order updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + id,
                }
            })
        })
        .catch((err) => {
            res.status(500).json({error: err});
        })    
};