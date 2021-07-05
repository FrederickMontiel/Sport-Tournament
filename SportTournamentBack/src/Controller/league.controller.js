"use strict";
/*const { response } = require('express');
const leagueModel = require('../Models/league.model');*/
//Imports
var LeagueModel = require("../Models/league.model");
var TeamModel = require("../Models/teams.model");
var UserModel = require("../Models/user.model");

//List league
function getLeagues(req, res) {
  var idUsuario = req.params.idUsuario;
  var dataToken = req.user;
  var responseData = [];

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    LeagueModel.find({ userCreator: idUsuario }, (err, ligas) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Error en el servidor al obtener las ligas" });
      } else {
        res.status(200).send({ league: ligas });
      }
    });
  } else {
    res.status(403).send({ message: "No ver ligas" });
  }
}

/*function getLeagues(req, res) {
  var idUsuario = req.user.sub;
  var data = req.user;

  if (data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)) {
    LeagueModel.find({ userCreator: idUsuario })
      .populate("userCreator", "user")
      .exec((err, ligas) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error en el servidor al obtener las ligas" });
        } else {
          if (ligas && ligas.length > 0) {
            res.status(200).send({ ligas });
          } else {
            res.status(404).send({ message: "No hay ligas" });
          }
        }
      });
  } else {
    res.status(403).send({ message: "No ver ligas" });
  }
}*/

//ADD league
function addLeague(req, res) {
  var params = req.body;
  var idUsuario = req.params.idUsuario;
  var dataToken = req.user;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    LeagueModel.findOne(
      { name: params.name, userCreator: idUsuario },
      (err, leagueFind) => {
        if (err) {
          res.status(500).send({
            message: "Error en el servidor al buscar una liga a un usuario",
          });
        } else {
          if (!leagueFind) {
            var insertModel = new LeagueModel({
              name: params.name,
              image: params.image,
              userCreator: idUsuario,
            });
            insertModel.save((err, league) => {
              if (err) {
                res.status(500).send({
                  message:
                    "Error en el servidor al integrar una liga a un usuario",
                });
              } else {
                if (league) {
                  res
                    .status(200)
                    .send({ message: "Se integro con exito", league });
                } else {
                  res.status(404).send({
                    message: "Datos nulos como respuesta del servidor",
                  });
                }
              }
            });
          } else {
            res.status(403).send({
              message: "Ya existe una liga con ese nombre para este usuario",
            });
          }
        }
      }
    );
  } else {
    res.status(403).send({ message: "No puedes agregar una liga" });
  }
}

//Edit league
function editLeague(req, res) {
  var params = req.body;
  var idLiga = req.params.idLiga;
  var idUsuario = req.params.idUsuario;
  var dataToken = req.user;

  var schema = {};
  params.name ? (schema.name = params.name) : null;
  params.image ? (schema.image = params.image) : null;
  dataToken.rol == "ADMIN" ? (schema.userCreator = idUsuario) : null;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && createUser == dataToken.sub)
  ) {
    LeagueModel.findByIdAndUpdate(
      idLiga,
      schema,
      { new: true },
      (err, edited) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error en el servidor al editar una liga" });
        } else {
          if (edited) {
            res.status(200).send({ message: "Se edit贸 con exito", edited });
          } else {
            res
              .status(404)
              .send({ message: "Datos nulos como respuesta del servidor" });
          }
        }
      }
    );
  } else {
    res.status(403).send({ message: "No puedes editar esta liga" });
  }
}

//Delete league
function deleteLeague(req, res) {
  var idLiga = req.params.idLiga;
  var idUsuario = req.params.idUsuario;
  var dataToken = req.user;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    LeagueModel.findByIdAndDelete(idLiga, (err, deleted) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Error en el servidor al eliminar una liga" });
      } else {
        if (deleted) {
          res.status(200).send({ message: "Se elimin贸 con exito", deleted });
        } else {
          res
            .status(404)
            .send({ message: "No se encontr贸 la liga que quieres eliminar" });
        }
      }
    });
  } else {
    res.status(403).send({ message: "No puedes eliminar esta liga" });
  }
}

module.exports = {
  getLeagues,
  addLeague,
  editLeague,
  deleteLeague,
};
