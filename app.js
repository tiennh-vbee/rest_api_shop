const express = require('express');
const app = express();
const morgan = require('morgan');
const bpdyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');
const bodyParser = require('body-parser');

// connect to mongoDB
const db = require('./connect_db');
db.connect();

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); // mdw handle static file(make files become static so that everyone can access)
// format json and urlencoded request data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// middleware prevent cors error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // can access API from any origin
    res.header('Access-Control-Allow-Headers', 
               'Origin, X-Requested-With, Content-Type, Accept, Authorization');
               // which kind of headers want to accept
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods',
                   'PUT, POST, PATCH, DELETE, GET');
        return res.json();
    }
    next();           
}); 

app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

// middleware handling not found error (custom error)
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    console.log(error);
    next(error); // nhay xuong middleware ke tiep
});

// middleware handling all kinds of error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        errorbro: {
            message: error.message,
            statusCode: error.status,
        },
    });
});

module.exports = app;