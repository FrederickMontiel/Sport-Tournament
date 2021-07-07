"use strict";

//Imports
var express = require("express");
var teamController = require('../controller/teams.controller');
var md_authentication = require("../middlewares/authentication");

//Routes
var api = express.Router();
api.get("/user/:idUsuario/league/:idLiga/max", md_authentication.ensureAuth, teamController.getMaxJourneys);
api.get("/user/:idUsuario/league/:idLiga/teams", md_authentication.ensureAuth, teamController.getTeams);
api.get("/user/:idUsuario/league/:idLiga/team/:idTeam", md_authentication.ensureAuth, teamController.getTeam);
api.post("/user/:idUsuario/league/:idLiga/team", md_authentication.ensureAuth, teamController.addTeam);
api.put("/user/:idUsuario/league/:idLiga/team/:idTeam", md_authentication.ensureAuth, teamController.editTeam);
api.delete("/user/:idUsuario/league/:idLiga/team/:idTeam", md_authentication.ensureAuth, teamController.deleteTeam);

//Exports
module.exports = api;
