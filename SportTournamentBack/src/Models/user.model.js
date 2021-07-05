"use strict";

//Variables
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Model
var userSchema = Schema({
  name: String,
  lastName: String,
  email: String,
  user: String,
  password: String,
  rol: { type: String, default: "CLIENT" },
});

//Exports
module.exports = mongoose.model("users", userSchema);
