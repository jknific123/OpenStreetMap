const mongoose = require('mongoose');
const User = mongoose.model('UserModel');


const allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

const userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

const adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

const moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

const getAllUsers = (req, res) => {
    User
        .find()
        .exec((error, users) => {
            if (!users) {
                return res.status(404).json({
                    "msg":
                        "Can not find users."
                });
            } else if (error) {
                return res.status(500).json(error);
            }
            res.status(200).json(users);
        });
};

module.exports = {
  getAllUsers,
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
};