//Imports
const teamsModel = require("../models/teams.model");
const scoreModel = require("../models/score.model");
const TeamsModel = require("../models/teams.model");
const { model } = require("mongoose");

//list teams
function getTeams(req, res) {
  var idUsuario = req.params.idUsuario;
  var idLiga = req.params.idLiga;
  var dataToken = req.user;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    TeamsModel.find({ league: idLiga }, (err, team) => {
      if (err) {
        res.status(500).send({
          message: "Error en el servidor al integrar un equipo a una liga",
        });
      } else {
        if (team && team.length > 0) {
          var responseData = [];

          team.forEach((dato) => {
            getMoreData(dato._id, (err, marcador) => {
              if (err) {
                //"Error en el servidor: No se pudo obtener la cantidad de puntos"
                res.status(500).send({ message: err });
              } else {
                responseData.push({
                  _id: dato._id,
                  name: dato.name,
                  image: dato.image,
                  league: dato.league,
                  marcador,
                });
              }

              if (team[team.length - 1]._id == dato._id) {
                res.status(200).send({ teams: responseData });
              }
            });
            //res.status(200).send({ equipos: team });
          });
        } else {
          res
            .status(404)
            .send({ message: "Datos nulos como respuesta del servidor" });
        }
      }
    });
  } else {
    res.status(500).send({ message: "No puedes ver los equipos" });
  }
}

function getMaxJourneys(req, res) {
  var idUsuario = req.params.idUsuario;
  var idLiga = req.params.idLiga;
  var dataToken = req.user;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    TeamsModel.find({ league: idLiga }, (err, team) => {
      if (err) {
        res.status(500).send({
          message: "Error en el servidor al integrar un equipo a una liga",
        });
      } else {
        if (team && team.length > 0) {
          var maximo = team.length;
          res.status(200).send({ maximo: maximo });
        } else {
          res
            .status(404)
            .send({ message: "Datos nulos como respuesta del servidor" });
        }
      }
    });
  } else {
    res.status(500).send({ message: "No puedes ver los equipos" });
  }
}

function getMoreData(id, callback) {
  scoreModel.find({ $or: [{ teamOne: id }, { teamTwo: id }] }, (err, data) => {
    if (err) {
      callback("Error en la consulta al encontrar equipos en el score", false);
    } else {
      var pj = 0,
        g = 0,
        e = 0,
        p = 0,
        gf = 0,
        gc = 0,
        dg = 0,
        pts = 0;

      pj = data.length;

      data.forEach((puntaje) => {
        if (id == String(puntaje.teamOne)) {
          gf += puntaje.pointsOne;
          gc += puntaje.pointsOne;

          if (puntaje.pointsOne < puntaje.pointsTwo) {
            p++;
          } else if (puntaje.pointsOne != puntaje.pointsTwo) {
            g++;
            pts += 3;
          } else {
            pts += 1;
          }
        } else if (id == String(puntaje.teamTwo)) {
          gf += puntaje.pointsTwo;
          gc += puntaje.pointsOne;

          if (puntaje.pointsTwo < puntaje.pointsOne) {
            p++;
          } else if (puntaje.pointsOne != puntaje.pointsTwo) {
            g++;
            pts += 3;
          } else {
            pts += 1;
          }
        }

        if (puntaje.pointsOne == puntaje.pointsTwo) {
          e++;
        }

        dg = gf - gc;
      });

      callback(false, { pj, g, e, p, gf, gc, dg, pts });
    }
  });
}

//data team
function getTeam(req, res) {
  var idUsuario = req.params.idUsuario;
  var idLiga = req.params.idLiga;
  var idTeam = req.params.idTeam;
  var dataToken = req.user;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    TeamsModel.findOne({ _id: idTeam, league: idLiga }, (err, team) => {
      if (err) {
        res.status(500).send({
          message: "Error en el servidor al integrar un equipo a una liga",
        });
      } else {
        if (team) {
          var responseData = [];

          getMoreData(team._id, (err, marcador) => {
            if (err) {
              res.status(500).send({ message: err });
            } else {
              responseData.push({
                _id: team._id,
                name: team.name,
                image: team.image,
                userCreator: team.userCreator,
                league: team.league,
                marcador,
              });
              res.status(200).send({ team: responseData });
            }
          });
          //res.status(200).send({ equipos: team });
        } else {
          res
            .status(404)
            .send({ message: "Datos nulos como respuesta del servidor" });
        }
      }
    });
  } else {
    res.status(500).send({ message: "No puedes ver los equipos" });
  }
}

function getTeamUser(req, res) {
  var idTeam = req.params.idTeam;
  TeamsModel.findById(idTeam).exec((err, team) => {
    if (err) return res.status(500).send({ message: "Error" });
    if (team) {
      return res.status(200).send({ team });
    }
  });
}

//add teams
function addTeam(req, res) {
  var params = req.body;
  var idUsuario = req.params.idUsuario;
  var idLiga = req.params.idLiga;
  var dataToken = req.user;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    teamsModel.findOne(
      { name: params.name, league: idLiga },
      (err, teamFound) => {
        if (err) {
          res.status(500).send({
            message: "Error en el servidor al buscar un equipo en una liga",
          });
        } else {
          if (!teamFound) {
            teamsModel.find({ league: idLiga }, (err, equipos) => {
              if (err) {
                res.status(500).send({
                  message: "Error al buscar equipos de una liga",
                });
              } else {
                if (equipos.length < 10) {
                  var modelo = new TeamsModel({
                    name: params.name,
                    image: params.image,
                    league: idLiga,
                  });
                  modelo.save((err, equipo) => {
                    if (err) {
                      res.status(500).send({
                        message: "Error al agregar equipo",
                      });
                    } else {
                      if (equipo) {
                        res.status(200).send({
                          equipo,
                        });
                      } else {
                        res.status(500).send({
                          message: "Datos no encontrados",
                        });
                      }
                    }
                  });
                } else {
                  res.status(403).send({
                    message: "Maximo de equipos en esta liga alcanzado",
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
    res.status(500).send({ message: "No puedes agregar los equipos" });
  }
}

//edit teams
function editTeam(req, res) {
  var params = req.body;
  var idUsuario = req.params.idUsuario;
  var idTeam = req.params.idTeam;
  var idLeague = req.params.idLeague;
  var dataToken = req.user;

  var schema = {};
  params.name ? (schema.name = params.name) : null;
  params.image ? (schema.image = params.image) : null;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    teamsModel.findByIdAndUpdate(
      idTeam,
      schema,
      { new: true },
      (err, edited) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error en el servidor al editar un equipo" });
        } else {
          if (edited) {
            res.status(200).send({ message: "Se editó con exito", edited });
          } else {
            res
              .status(404)
              .send({ message: "Datos nulos como respuesta del servidor" });
          }
        }
      }
    );
  } else {
    res.status(403).send({ message: "No puedes editar este equipo" });
  }
}

//delete teams
function deleteTeam(req, res) {
  var idUsuario = req.params.idUsuario;
  var idTeam = req.params.idTeam;
  var dataToken = req.user;

  //dataToken.rol == "ADMIN" ? (schema.league = idLeague) : null;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    teamsModel.findByIdAndDelete(idTeam, (err, delited) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Error en el servidor al eliminar un equipo" });
      } else {
        if (delited) {
          res.status(200).send({ message: "Se elimino con exito", delited });
        } else {
          res
            .status(404)
            .send({ message: "Datos nulos como respuesta del servidor" });
        }
      }
    });
  } else {
    res.status(403).send({ message: "No puedes eliminar este equipo" });
  }
}

module.exports = {
  addTeam,
  getTeams,
  getTeam,
  editTeam,
  deleteTeam,
  getMaxJourneys,
  getTeamUser,
};
