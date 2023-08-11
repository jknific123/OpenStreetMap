const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/controllerUsers');
const ctrlAuth = require('../controllers/controllerAuth');
const ctrlPython = require('../controllers/controllerPython')
const ctrlLocationReport = require('../controllers/controllerLocationReport');
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(403)
    }
    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, user) => {
        if (err) {
            // ima token ampak je pretekel exp date
            return res.sendStatus(401);
        }
        req.user = user
        next();
    })
}

// Users api
router.get('/users', authenticateToken, ctrlUsers.getAllUsers);
router.get('/user/:id', authenticateToken, ctrlUsers.getUserById);
router.put('/update_user/:id', authenticateToken, ctrlUsers.userUpdate);
router.delete('/delete_user/:id', authenticateToken, ctrlUsers.userDelete);
router.post('/register_user', ctrlUsers.registerUser);

// auth api
router.post('/login', ctrlAuth.loginUser);
router.post('/logout', authenticateToken, ctrlAuth.logoutUser);
router.post('/refresh_token', ctrlAuth.refreshAccessToken);

// python api
router.post('/get_pois', ctrlPython.getPointsOfInterest);

// location report
router.post('/save_location_report', ctrlLocationReport.saveLocationReport);
router.get('/get_location_reports/:userId', ctrlLocationReport.getLocationReportsForUser);

module.exports = router;
