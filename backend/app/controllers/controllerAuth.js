const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');

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
        console.log(userToLogin);
        console.log(userToLogin.password);
        if (await bcrypt.compare(req.body.password, userToLogin.password)) {
            res.send('Successful login.');
        }
        else {
            res.send('Unsuccessful login.');
        }
    } catch (error) {
        res.status(500).send('Unsuccessful login.');
    }

}

module.exports = {
    loginUser
}