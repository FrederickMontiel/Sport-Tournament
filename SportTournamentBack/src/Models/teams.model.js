"use strict";

//Variables
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Model
var teamsSchema = Schema({
  image: String,
  name: String,
  league: { type: Schema.Types.ObjectId, ref: "leagues" }
});

//Exports
module.exports = mongoose.model("teams", teamsSchema);
