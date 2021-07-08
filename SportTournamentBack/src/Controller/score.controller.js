const ScoreModel = require("../models/score.model");
const TeamsModel = require("../models/teams.model");
const LeagueModel = require("../models/league.model");
const UserModel = require("../models/user.model");

function getScore(req, res) {
  var idUsuario = req.params.idUsuario;
  var idScore = req.params.idScore;
  var dataToken = req.user;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    ScoreModel.find({ score: idScore })
      .populate("teams")
      .exec((err, score) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error en el servidor al ver un score" });
        } else {
          if (score) {
            res.status(200).send({ message: "Se integró con exito", score });
          } else {
            res
              .status(404)
              .send({ message: "Datos nulos como respuesta del servidor" });
          }
        }
      });
  } else {
    res.status(500).send({ message: "No puedes ver los scores" });
  }
}

function addScore(req, res) {
  var params = req.body;
  var idUsuario = req.params.idUsuario;
  var idLiga = req.params.idLiga;
  var dataToken = req.user;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    if (params.teamOne != params.teamTwo) {
      verifyNumberJurneys(params.journey, idLiga, (err) => {
        if (err) {
          res.status(500).send({ message: err });
        } else {
          verifyBothTeamsExists(params.teamOne, params.teamTwo, (err) => {
            if (err) {
              res.status(500).send({ message: err });
            } else {
              verifyConfrontationIsExist(
                params.teamOne,
                params.teamTwo,
                idLiga,
                (exist) => {
                  if (exist) {
                    res.status(500).send({ message: exist });
                  } else {
                    if (params.teamOne != params.teamTwo) {
                      var modelo = new ScoreModel({
                        journey: params.journey,
                        league: idLiga,
                        teamOne: params.teamOne,
                        pointsOne: params.pointsOne,
                        teamTwo: params.teamTwo,
                        pointsTwo: params.pointsTwo,
                      });

                      modelo.save((err, saved) => {
                        if (err) {
                          res
                            .status(500)
                            .send({ message: "Error al agregar score" });
                        } else {
                          res.status(200).send({ message: saved });
                        }
                      });
                    } else {
                      res.status(403).send({
                        message: "Los equipos no pueden ser los mismos",
                      });
                    }
                  }
                }
              );
            }
          });
        }
      });
    } else {
      res.status(500).send({ message: "Son los mismos equipos" });
    }
  } else {
    res.status(500).send({ message: "No puedes agregar los equipos" });
  }
}

function editScore(req, res) {
  var params = req.body;
  var idUsuario = req.params.idUsuario;
  var idScore = req.params.idScore;
  var dataToken = req.user;

  var schema = {};
  params.journey ? (schema.journey = params.journey) : null;
  params.name ? (schema.name = params.name) : null;
  params.teamOne ? (schema.teamOne = params.teamOne) : null;
  params.pointsOne ? (schema.pointsOne = params.pointsOne) : null;
  params.teamTwo ? (schema.teamTwo = params.teamTwo) : null;
  params.pointsTwo ? (schema.pointsTwo = params.pointsTwo) : null;

  dataToken.rol == "ADMIN" ? (schema.score = idScore) : null;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    if (params.teamOne != params.teamTwo) {
      TeamsModel.findByIdAndUpdate(
        idTeam,
        schema,
        { new: true },
        (err, edited) => {
          if (err) {
            res
              .status(500)
              .send({ message: "Error en el servidor al editar un score" });
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
      res.status(403).send({ message: "Los equipos no pueden ser los mismos" });
    }
  } else {
    res.status(403).send({ message: "No puedes editar este score" });
  }
}

function deleteScore(req, res) {
  var idUsuario = req.params.idUsuario;
  var idScore = req.params.idScore;
  var dataToken = req.user;

  dataToken.rol == "ADMIN" ? (schema.score = idScore) : null;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    TeamsModel.findByIdAndDelete(idTeam, (err, delited) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Error en el servidor al eliminar un score" });
      } else {
        if (edited) {
          res.status(200).send({ message: "Se elimino con exito", delited });
        } else {
          res
            .status(404)
            .send({ message: "Datos nulos como respuesta del servidor" });
        }
      }
    });
  } else {
    res.status(403).send({ message: "No puedes eliminar este score" });
  }
}

/* -------------------------- Funciones Reutilizables ------------------------ */
function verifyNumberJurneys(numero, liga, callback) {
  TeamsModel.find({ league: liga }, (err, equipos) => {
    if (err) {
      callback("Error en la consulta al verificar cantidad de jornadas");
      //res.status(500).send({message: "Error en el servidor al verificar un espacio en la jornada [Ligas]"});
    } else {
      if (numero < equipos.length) {
        callback(false);
        console.log(numero, equipos.length);
      } else {
        callback(
          "La jornada que quieres agregar es mas alta de la que se admite."
        );
      }
    }
  });
}

function verifyBothTeamsExists(teamOne, teamTwo, callback) {
  console.log(teamOne, teamTwo);
  TeamsModel.findOne({ _id: teamOne }, (err, equipoOne) => {
    console.log("Si esta el", equipoOne);
    if (err) {
      callback(
        "Error en la consulta al verificar la existencia del equipo 1",
        err
      );
    } else {
      if (equipoOne) {
        TeamsModel.findById(teamTwo, (err, equipoTwo) => {
          if (err) {
            callback(
              "Error en la consulta al verificar la existencia del equipo 2"
            );
          } else {
            if (equipoTwo) {
              var uno = String(equipoOne.league);
              var dos = String(equipoTwo.league);

              if (uno == dos) {
                callback(false);
              } else {
                callback("Los equipos no pertenecen a la misma liga");
              }
            } else {
              callback("No existe el equipo 2");
            }
          }
        });
      } else {
        callback("No existe el equipo 1");
      }
    }
  });
}

function verifyConfrontationIsExist(teamOne, teamTwo, idLiga, callback) {
  ScoreModel.find(
    { teamOne: teamOne, teamTwo: teamTwo, league: idLiga },
    (err, score) => {
      if (err) {
        callback("Error al verificar la existencia de un enfrentamiento 1");
      } else {
        if (score && score.length > 0) {
          callback("Ya existe un enfrentamiento en estas jornadas.");
        } else {
          ScoreModel.find(
            { teamOne: teamTwo, teamTwo: teamOne, league: idLiga },
            (err, score) => {
              if (err) {
                callback(
                  "Error al verificar la existencia de un enfrentamiento 2"
                );
              } else {
                if (score && score.length > 0) {
                  callback("Ya existe un enfrentamiento en estas jornadas.");
                } else {
                  callback(false);
                }
              }
            }
          );
        }
      }
    }
  );
}

function getPDF(req, res) {
  var params = req.body;

  leagueModel.findOne({ name: params.name }).exec((err, leagueData) => {
    var contentPDF =
      "<!DOCTYPE html><html><head><style>*{font-family: arial;} table{width: 100%; border-collapse: collapse;} td{width: 25%;} .scoreData{background-color: black; color: white; font-weight: bolder;}</style></head><body><h3>" +
      leagueData.name +
      "</h3><table><tr><td class='scoreData'>journey</td><td class='scoreData'>teamOne</td><td class='scoreData'>pointsOne</td><td class='scoreData'>teamTwo</td><td class='scoreData'>pointsTwo</td>";

    contenidoPdf += "<tr>";
    contenidoPdf +=
      "<td>" +
      scoreModel.journey +
      "</td><td>" +
      scoreModel.teamOne +
      "</td><td>" +
      scoreModel.pointsOne +
      "</td><td>" +
      scoreModel.teamTwo +
      "</td><td>" +
      scoreModel.pointsTwo;
    contenidoPdf += "</tr>";
  });

  contentPDF += "</table></body></html>";

  htmlPdf
    .create(contentPDF)
    .toFile(
      "./pdf/listaJornadas." + leagueData.name + ".pdf",
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send({
            response,
          });
        }
      }
    );
}

module.exports = {
  getScore,
  addScore,
  editScore,
  deleteScore,
};
