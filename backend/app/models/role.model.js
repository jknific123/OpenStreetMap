const mongoose = require("mongoose");

const RoleModel = mongoose.model(
  "RoleModel",
  new mongoose.Schema({
    name: String
  })
);

module.exports = RoleModel;