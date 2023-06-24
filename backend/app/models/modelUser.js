const mongoose = require('mongoose');


// kreiraj shemo
const schemaUser = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    role: String
});


//ustvari model
mongoose.model("User", schemaUser, "User");