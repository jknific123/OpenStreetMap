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
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});


//ustvari model
mongoose.model("User", schemaUser, "User");