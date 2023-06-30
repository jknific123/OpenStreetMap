const mongoose = require('mongoose');


// kreiraj shemo
const schemaRefreshToken = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    }
});


//ustvari model
mongoose.model("RefreshToken", schemaRefreshToken, "RefreshToken");