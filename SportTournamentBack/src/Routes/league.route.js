"use strict";

//Imports
var express = require("express");
var leagueController = require("../controller/league.controller");
var md_authentication = require("../middlewares/authentication");

//Routes
var api = express.Router();
api.get(
  "/user/:idUsuario/league",
  md_authentication.ensureAuth,
  leagueController.getLeagues
);
api.get("/user/league/:idLiga", leagueController.getLeague);
/*api.get(
  "/user/leagues",
  md_authentication.ensureAuth,
  leagueController.getLeagues
);*/
api.post(
  "/user/:idUsuario/league",
  md_authentication.ensureAuth,
  leagueController.addLeague
);
api.put(
  "/user/:idUsuario/league/:idLiga",
  md_authentication.ensureAuth,
  leagueController.editLeague
);
api.delete(
  "/user/:idUsuario/league/:idLiga",
  md_authentication.ensureAuth,
  leagueController.deleteLeague
);

//Exports
module.exports = api;
