const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = function(req, file, cb){
    const typeFile = ['image/jpeg', 'image/jpg', 'image/png'];
    if(typeFile.includes(file.mimetype)){
        cb(null, true); // store a file
    }
    else{
        cb(null, false); // reject a file
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
});


router.get('/', ProductsController.prods_get_all);

router.post('/', upload.single('productImage'), ProductsController.prods_create_prod);

router.get('/:productId', ProductsController.prods_get_prod);

router.patch('/:productID', ProductsController.prods_edit_prod);

router.delete('/:productID', ProductsController.prods_delete_prod);

module.exports = router;