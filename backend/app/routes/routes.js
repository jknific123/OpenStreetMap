const express = require('express');
const router = express.Router();

const ctrlUsers = require('../controllers/controllerUsers');
const ctrlAuth = require('../controllers/controllerAuth');

// Users api
router.get('/users', ctrlUsers.getAllUsers);
router.get('/user/:id', ctrlUsers.getUserById);
router.post('/register_user', ctrlUsers.registerUser);
router.put('/update_user/:id', ctrlUsers.userUpdate);
router.delete('/delete_user/:id', ctrlUsers.userDelete);

// auth api
router.post('/login', ctrlAuth.loginUser);

module.exports = router;
