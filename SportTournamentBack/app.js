"use strict";

//Variables Globals
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

//Import
var user_routes = require("./src/Routes/user.router");
var league_routes = require("./src/Routes/league.route");
var teams_routes = require("./src/Routes/teams.route");
var score_routes = require("./src/Routes/score.route");

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//Route Application localhost:3000/api/
app.use("/api", user_routes, league_routes, teams_routes, score_routes);

//Exports
module.exports = app;
