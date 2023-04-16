const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');

router.get('/', UsersController.users_get_all);

router.post('/signup', UsersController.users_signup);

router.get('/:userId', UsersController.users_get_user);

router.post('/login', UsersController.users_login);

router.delete('/:userId', UsersController.users_delete_user);

module.exports = router;