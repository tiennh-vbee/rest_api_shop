const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

module.exports.users_get_all = (req, res) => {
    // Product.find().limit() // set limit hien thi
    User.find() // find all
        .select('_id email') // field want to display 
        .exec() // return a Promise
        .then((users) => {
            const response = {
                count: users.length,
                products: users.map(user => {
                    return {
                        _id: user._id,
                        email: user.email,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + user._id,
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

module.exports.users_signup = (req, res) => {
    User.find({email: req.body.email}) // check whether input email is existed in DB 
        .exec() // if not existed, return empty array not null, so need to set length >= 1 to be sure not existed
        .then((user) => {
            if(user.length >= 1){
                return res.status(422).json({
                    message: 'This email account is existed',
                })
            }
            else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err,
                        });
                    }
                    else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                        });
                        user
                            .save()
                            .then((result) => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created',
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    error: err,
                                });
                            });
                    }
                });
            }
        });
};

module.exports.users_get_user = (req, res) => {
    const id = req.params.userId;
    User.findById(id)
        .select('_id email password') // filter field to show
        .exec() // return a Promise
        .then((user) => {
            if(user){
                res.json({
                    user: user,
                    request: {
                        type: 'GET',
                        description: 'get specified user',
                        url: 'http://localhost:3000/users/' + user._id,
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

module.exports.users_login = (req, res, next) => {
    // User.findOne({email: req.body.email}) false because return null, when call null.length => error, jump to catch()
    User.find({email: req.body.email})
        .exec()
        .then((user) => {
            if(user.length < 1){
                return res.status(404).json({
                    message: 'Mail not found, user not exist!!!',
                });
            }
            else{
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if(err){
                        return res.status(404).json({
                            message: 'Password wrong. Try again!!!',
                        });
                    }
                    if(result){
                        const token = jwt.sign({
                            userId: user[0]._id,
                            email: user[0].email,
                        }, process.env.JWT_KEY,{
                            expiresIn: "1h",
                        });
                        return res.status(200).json({
                            message: 'Auth successfully',
                            token: token,
                        });
                    }
                    res.status(401).json({
                        message: 'Auth failed!!!',
                    });
                });
            }
        })
        .catch((err) => {
            console.log('Error happened');
            res.status(500).json({error: err});
        });
};

module.exports.users_delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'User deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/users/' + id,
                    body: {
                        email: 'String',
                        password: 'Number',
                    },
                },
            });            
        })
        .catch((err) => {
            res.status(500).json({error: err});
        });
};