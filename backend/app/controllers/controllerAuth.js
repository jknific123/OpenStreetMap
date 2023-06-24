require('dotenv').config()

const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// TODO login, logout

const loginUser = async (req, res) => {

    if (!req.body.name || !req.body.password) {
        return res.status(400).json({message: 'Not all required data was provided.'});
    }

    const userToLogin = await User.findOne({name: req.body.name});
    if (userToLogin == null) {
        return res.status(400).json({message: 'Cannot find user.'});
    }

    try {
        if (await bcrypt.compare(req.body.password, userToLogin.password)) {
            const plainUserObject = {
                name: userToLogin.name,
                email: userToLogin.email,
                role: userToLogin.role
            };
            const accessToken = jwt.sign(plainUserObject, process.env.ACCES_TOKEN_SECRET);
            res.json({accessToken: accessToken});
        }
        else {
            res.send('Unsuccessful login  .');
        }
    } catch (error) {
        console.log('error: ', error)
        res.status(500).send({message: error});
    }

}

module.exports = {
    loginUser
}