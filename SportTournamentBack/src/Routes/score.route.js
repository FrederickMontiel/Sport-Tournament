"use strict";

//Imports
var express = require("express");
var scoreController = require('../controller/score.controller');
var md_authentication = require("../middlewares/authentication");

//Routes
var api = express.Router();
api.get("/user/:idUsuario/scores", md_authentication.ensureAuth, scoreController.getScore);
api.post("/user/:idUsuario/league/:idLiga/score", md_authentication.ensureAuth, scoreController.addScore);
api.put("/user/:idUsuario/score/:idScore", md_authentication.ensureAuth, scoreController.editScore);
api.delete("/user/:idUsuario/score/:idScore", md_authentication.ensureAuth, scoreController.deleteScore);

//Exports
module.exports = api;