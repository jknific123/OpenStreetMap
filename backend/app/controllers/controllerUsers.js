const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {

    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log('Error occurred when getting all users: ', error);
        res.status(500).json({message: error.message});
    }

};

const getUserById = async (req, res) => {

    try {
        const userId = req.params.id;
        const userById = await User.findById(userId);
        if (userById == null) {
            res.status(404).json({ message: 'Cannot find user by id.'});
        }
        res.json(userById);
    } catch (error) {
        console.log('Error occurred when getting user by id: ', error);
        res.status(500).json({ message: error.message});
    }

};


const registerUser = async (req, res) => {

    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({message: 'Not all required data for registration was provided.'});
    }

    const tmpUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        // password: bcrypt.hashSync(req.body.password, 8)
        role: req.body.role
    });
    try {
        const newUSer = await tmpUser.save();
        res.status(201).json(newUSer);
    } catch (error) {
        console.log('Error occurred when creating new user: ', error);
        res.status(500).json({ message: error.message});
    }

};

const userUpdate = async (req, res) => {

    console.log('user id for update: ', req.params.id);

    try {
        const userId = req.params.id;
        const userById = await User.findById(userId);
        if (userById == null) {
            res.status(404).json({ message: 'Cannot find user by id for update.'});
        }

        if (req.body.name != null) {
            userById.name = req.body.name;
        }

        if (req.body.email != null) {
            userById.email = req.body.email;
        }

        // TODO updejtat se more dat tudi geslo

        if (req.body.role != null) {
            userById.role = req.body.role;
        }

        const updatedUser = await userById.save();
        console.log('Successfully updated user.');
        res.json(updatedUser);
    } catch (error) {
        console.log('Error occurred when updating user by id: ', error);
        res.status(500).json({ message: error.message});
    }

};

const userDelete = (req, res) => {
    User.findOneAndRemove({_id: req.params.id}, function(err, user) {
            // console.log(err, user);
            if (err || !user) {
                res.status(404).json({message: err});
            }
            else {
                console.log(`Successfully removed user wit id ${req.params.id}`);
                res.status(200).json(user);
            }
        });
};


module.exports = {
    getAllUsers,
    getUserById,
    registerUser,
    userUpdate,
    userDelete
}