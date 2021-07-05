"use strict";

//Imports
var express = require("express");
var userController = require("../controller/user.controller");
var md_authentication = require("../middlewares/authentication");

//Routes
var api = express.Router();
api.post("/user/register", userController.saveUser);
api.post("/user/add", md_authentication.ensureAuth, userController.addUser);
api.post("/user/login", userController.login);
api.get("/user/get", userController.getUsers);
api.get("/user/getId/:id", userController.getUserId);
api.put(
  "/user/edit/:idUsuario",
  md_authentication.ensureAuth,
  userController.editUser
);
api.delete(
  "/user/delete/:idUsuario",
  md_authentication.ensureAuth,
  userController.deleteUser
);

//Exports
module.exports = api;
