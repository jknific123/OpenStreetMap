const express = require('express');
const router = express.Router();

const ctrlUsers = require('../controllers/controllerUsers');


// Users api
router.get('/users', ctrlUsers.getAllUsers);
router.get('/user/:id', ctrlUsers.getUserById);
router.post('/create_user', ctrlUsers.createUser);
router.put('/update_user/:id', ctrlUsers.userUpdate);
router.delete('/delete_user/:id', ctrlUsers.userDelete);


module.exports = router;
