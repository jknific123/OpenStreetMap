require('dotenv').config()

const mongoose = require('mongoose');
const User = mongoose.model('User');
const RefreshToken = mongoose.model('RefreshToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const loginUser = async (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({message: 'Not all required data was provided.'});
    }

    const userToLogin = await User.findOne({email: req.body.email});
    if (userToLogin == null) {
        return res.status(400).json({message: 'Cannot find user.'});
    }

    try {
        if (await bcrypt.compare(req.body.password, userToLogin.password)) {
            const plainUserObject = {
                _id: userToLogin._id,
                name: userToLogin.name,
                email: userToLogin.email,
                role: userToLogin.role
            };
            const accessToken = generateAccesToken(plainUserObject);
            const refreshToken = jwt.sign(plainUserObject, process.env.REFRESH_TOKEN_SECRET);
            // shrani refresh token v bazo da lahko potem preverjas
            const savedRefreshToken = await saveRefreshToken(refreshToken);

            if (savedRefreshToken == null) {
                res.status(500).send({message: 'Failed saving the refresh token.'});
            }

            res.json({accessToken: accessToken, refreshToken: refreshToken});
        }
        else {
            res.send('Unsuccessful login.');
        }
    } catch (error) {
        console.log('error: ', error)
        res.status(500).send({message: error});
    }

}

const logoutUser = async (req, res) => {

    if (req.user == null) {
        res.status(401).send({ message: 'Error, no user data provided for logout!' });
        return; // Return early to avoid further execution
    }

    const refreshTokenToDelete = req.body.refreshToken;

    try {
        const deletedRefreshToken = await RefreshToken.findOneAndDelete({ content: refreshTokenToDelete });
        if (deletedRefreshToken) {
            console.log('Deleted refToken:', deletedRefreshToken);
            res.status(200).json({ message: 'User logged out successfully.' });
        } else {
            console.log('Refresh token not found.');
            res.status(404).json({ message: 'Refresh token not found.' });
        }
    } catch (error) {
        console.log('Error occurred when trying to logout user: ', error);
        res.status(500).json({message: error});
    }
}

function generateAccesToken(user) {
    return jwt.sign(user, process.env.ACCES_TOKEN_SECRET, {expiresIn: '10m'});
}

const refreshAccessToken = async (req, res) => {
    // funkcija, ki refresha accessToken ce je refreshToken veljaven oz shranjen v bazi

    const refreshToken = req.body.refreshToken
    if (refreshToken == null) {
       return res.sendStatus(401);
    }
    // check if refreshToken is saved in db
    if (await getRefreshTokenByContent(refreshToken) == null) {
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            // ima token ampak je pretekel exp date
            return res.sendStatus(403);
        }
        const plainUserObject = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        const accessToken = generateAccesToken(plainUserObject);
        res.json( {accessToken: accessToken} );
    })

}

async function saveRefreshToken(refreshToken) {

    if (refreshToken == null) {
        console.log('No refresh token was provided to save!!')
        return null;
    }

    const tmpRefreshToken = new RefreshToken({
        content: refreshToken
    });
    try {
        return await tmpRefreshToken.save();
    } catch (error) {
        console.log('Error occurred when saving new refresh token: ', error);
        return null;
    }
}

async function getRefreshTokenByContent(refreshToken) {

    try {
        const refreshTokenByContent = await RefreshToken.find({content: refreshToken});
        if (refreshTokenByContent == null) {
            console.log('Cannot find refreshToken.');
            return null;
        }
        return refreshTokenByContent;
    } catch (error) {
        console.log('Error occurred when getting refreshToken: ', error);
        return null;
    }
}

module.exports = {
    loginUser,
    logoutUser,
    refreshAccessToken
}