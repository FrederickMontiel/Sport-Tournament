"use strict";

//Variables Globals
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

//Import
var user_routes = require("./src/routes/user.router");
var league_routes = require("./src/routes/league.route");
var teams_routes = require("./src/routes/teams.route");
var score_routes = require("./src/routes/score.route");

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//Route Application localhost:3000/api/
app.use("/api", user_routes, league_routes, teams_routes, score_routes);

//Exports
module.exports = app;
