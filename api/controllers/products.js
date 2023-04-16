const Product = require('../models/Products');
const mongoose = require('mongoose');

module.exports.prods_get_all = (req, res) => {
    // Product.find().limit() // set limit hien thi
    Product.find() // find all
        .select('_id name price productImage') // field want to display 
        .exec() // return a Promise
        .then((prods) => {
            const response = {
                count: prods.length,
                products: prods.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id,
                        }
                    }
                }),
            }
            res.json(response);
        })
        .catch((err) => {
            res.status(500).json({error: err});
        })
};

module.exports.prods_create_prod = (req, res) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    product
        .save()
        .then((result) => {
            res.json({
                message: 'Created product successfully',
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: req.body.productImage,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products/' + result._id,
                    }
                },
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({error: err});
        });  // stored in DB, return a Promise
};

module.exports.prods_get_prod = (req, res) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id') // filter field to show
        .exec() // return a Promise
        .then((prod) => {
            if(prod){
                res.json({
                    product: prod,
                    request: {
                        type: 'GET',
                        description: 'get specified product',
                        url: 'http://localhost:3000/products/' + prod._id,
                    }
                });
            }
            else{
                // xay ra khi ID cung length nhung khac value
                res.status(404).json({message: 'No valid entry founded ID'});
            }
        })
        .catch((err) => {
            // xay ra khi length ko khop
            res.json({error: err});
        });
};

module.exports.prods_edit_prod = (req, res) => {
    const id = req.params.productID;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    // example with a patch request in raw json form
    // [
    //     {
    //         "propName": "price", "value": 1200
    //     }
    // ]

    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then((result) => {
            // res.redirect('/products');
            res.json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id,
                }
            })
        })
        .catch((err) => {
            res.status(500).json({error: err});
        })
};

module.exports.prods_delete_prod = (req, res) => {
    const id = req.params.productID;
    Product.remove({_id: id})
        .exec()
        .then((result) => {
            // res.redirect('/products');
            res.json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + id,
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