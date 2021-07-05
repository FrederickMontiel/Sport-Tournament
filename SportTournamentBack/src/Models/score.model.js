"use strict";

//Variables
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Model
var scoreSchema = Schema({
  journey: Number,
  league: String,
  teamOne:{ type: Schema.Types.ObjectId, ref: "teams" },
  pointsOne: Number,
  teamTwo:{ type: Schema.Types.ObjectId, ref: "teams" },
  pointsTwo: Number
});

//Exports
module.exports = mongoose.model("scores", scoreSchema);
