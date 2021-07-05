"use strict";

//Variables
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Model
var leagueSchema = Schema({
  image: String,
  name: String,
  userCreator:{ type: Schema.Types.ObjectId, ref: "users" },
});

//Exports
module.exports = mongoose.model("leagues", leagueSchema);
