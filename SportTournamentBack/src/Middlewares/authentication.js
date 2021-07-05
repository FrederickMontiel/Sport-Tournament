"user strict";

//Imports
var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "secret_password";

//Export Functions
exports.ensureAuth = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(404).send({
      message: "La peticion no tiene la cabecera en la Autenticacion",
    });
  }

  var token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        message: "El token ha experido",
      });
    }
  } catch (error) {
    return res.status(404).send({ message: "El token no es valido" });
  }
  req.user = payload;
  next();
};

//Este es el nuevo proyecto
