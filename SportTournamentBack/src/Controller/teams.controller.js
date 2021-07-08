//Imports
const teamsModel = require("../models/teams.model");
const scoreModel = require("../models/score.model");
const TeamsModel = require("../models/teams.model");
const { model } = require("mongoose");
const leagueModel = require("../models/league.model");
const htmlPdf = require("html-pdf");

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

function genPdf(req, res){
  var idUsuario = req.params.idUsuario;
  var idLiga = req.params.idLiga;

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
                writePdf(responseData, req, res);
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
}

function writePdf(datos, req, res){
  leagueModel.findById(datos[0].league, (err, a) => {
    if(err){
      res.status(500).send({message: "Error al buscar datos de la liga"});
    }else{
      if(a){
        var contentPDF =
          `<!DOCTYPE html>
          <html>
          <head>
            <style>*{font-family: arial;} table{width: 100%; border-collapse: collapse;} td{width: 10%;} .scoreData{background-color: black; color: white; font-weight: bolder;}</style>
          </head>
          <body>
          <h3>` + a.name + `</h3>
          <table>
            <tr>
              <td class='scoreData'>Imagen</td>
              <td class='scoreData'>Nombre</td>
              <td class='scoreData'>PJ</td>
              <td class='scoreData'>G</td>
              <td class='scoreData'>E</td>
              <td class='scoreData'>P</td>
              <td class='scoreData'>GF</td>
              <td class='scoreData'>GC</td>
              <td class='scoreData'>DG</td>
              <td class='scoreData'>PTS</td>
            </tr>`;
          datos.forEach(dato => {
            contentPDF += `<tr>
              <td><img src="` + dato.image + `" style="width: 25px; height: 25px;"></td>
              <td>` + dato.name + `</td>
              <td>` + dato.marcador.pj + `</td>
              <td>` + dato.marcador.g + `</td>
              <td>` + dato.marcador.e + `</td>
              <td>` + dato.marcador.p + `</td>
              <td>` + dato.marcador.gf + `</td>
              <td>` + dato.marcador.gc + `</td>
              <td>` + dato.marcador.dg + `</td>
              <td>` + dato.marcador.pts + `</td>
            </tr>`;
          });
          
        contentPDF += `</table>
      </body>
      </html>`;

          htmlPdf
          .create(contentPDF)
          .toFile(
            "./pdf/teams/" + a._id + ".pdf",
            (err, response) => {
              if (err) {
                res.status(500).send({
                  message:"Error al crear el pdf"
                });
              } else {
                console.log(__dirname);
                res.status(200).send({ url: "https://torneos.easyprojects.tech/api/pdf/" + a._id});
              }
            }
          );
      }else{
        res.status(404).send({message: "No se pudo encontrar la liga"});
      }
    }
  });
}

function getPdf(req, res){
  res.download(__dirname + "../../../pdf/teams/" + req.params.idPdf + ".pdf");
}

module.exports = {
  addTeam,
  getTeams,
  getTeam,
  editTeam,
  deleteTeam,
  getMaxJourneys,
  getTeamUser,
  genPdf,
  getPdf
};
