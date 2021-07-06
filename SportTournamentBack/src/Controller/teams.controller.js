//Imports
const teamsModel = require("../Models/teams.model");
const scoreModel = require("../Models/score.model");
const TeamsModel = require("../Models/teams.model");

//list teams
function getTeams(req, res) {
    var idUsuario = req.params.idUsuario;
    var idLiga = req.params.idLiga;
    var dataToken = req.user;

    if (dataToken.rol == "ADMIN" || (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)) {
        TeamsModel.find({ league: idLiga }, (err, team) => {
            if (err) {
                res.status(500).send({
                    message: "Error en el servidor al integrar un equipo a una liga",
                });
            } else {
                if (team && team.length > 0) {
                    team.forEach((dato) => {
                        getPJ()
                        //res.status(200).send({ equipos: team });
                    });
                } else {
                    res.status(404).send({ message: "Datos nulos como respuesta del servidor" });
                }
            }
        });
    } else {
        res.status(500).send({ message: "No puedes ver los equipos" });
    }
}

function getPJ(id, callback){
    scoreModel.find({$or  : {pointsUno}});
}

//data team
function getTeam(req, res) {
    var idUsuario = req.params.idUsuario;
    var idLiga = req.params.idLiga;
    var dataToken = req.user;

    if (dataToken.rol == "ADMIN" || (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)) {
        TeamsModel.findOne({ league: idLiga }, (err, team) => {
            if (err) {
                res.status(500).send({
                    message: "Error en el servidor al integrar un equipo a una liga",
                });
            } else {
                if (team) {
                    res.status(200).send({ message: "Se encontro con exito", team });
                } else {
                    res.status(404).send({ message: "Datos nulos como respuesta del servidor" });
                }
            }
        });
    } else {
        res.status(500).send({ message: "No puedes ver los equipos" });
    }
}

//add teams
function addTeam(req, res) {
    var params = req.body;
    var idUsuario = req.params.idUsuario;
    var idLiga = req.params.idLiga;
    var dataToken = req.user;

    if (dataToken.rol == "ADMIN" || (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)) {
        teamsModel.findOne({ name: params.name, league: idLiga }, (err, teamFound) => {
            if (err) {
                res.status(500).send({
                    message: "Error en el servidor al buscar un equipo en una liga",
                });
            } else {
                if (!teamFound) {
                    var modelo = new TeamsModel({
                        name: params.name,
                        image: params.image,
                        league: idLiga,
                    });
                    teamsModel.countDocuments({}, (err, conteo) => {
                        console.log(conteo);
                        if (conteo >= 10) {
                            res.status(500).send({
                                message: "Error al agregar equipo, Limite de equipos superado en una liga",
                            });
                        } else {
                            modelo.save((err, team) => {
                                if (err) {
                                    res.status(500).send({
                                        message: "Error en el servidor al integrar un equipo a una liga",
                                    });
                                } else {
                                    if (team) {
                                        conteo = conteo + 1;
                                        res.status(200).send({ message: "Se integró con exito", team, Equipos: conteo });
                                    } else {
                                        res.status(404).send({ message: "Datos nulos como respuesta del servidor" });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    res.status(403).send({
                        message: "Ya existe una liga con ese nombre para este usuario",
                    });
                }
            }
        });
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
    dataToken.rol == "ADMIN" ? (schema.league = idLeague) : null;

    dataToken.rol == "ADMIN" ? (schema.league = idLeague) : null;

    if (dataToken.rol == "ADMIN" || (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)) {
        teamsModel.findByIdAndUpdate(idTeam, schema, { new: true }, (err, edited) => {
            if (err) {
                res.status(500).send({ message: "Error en el servidor al editar un equipo" });
            } else {
                if (edited) {
                    res.status(200).send({ message: "Se editó con exito", edited });
                } else {
                    res.status(404).send({ message: "Datos nulos como respuesta del servidor" });
                }
            }
        });
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

    if (dataToken.rol == "ADMIN" || (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)) {
        teamsModel.findByIdAndDelete(idTeam, (err, delited) => {
            if (err) {
                res.status(500).send({ message: "Error en el servidor al eliminar un equipo" });
            } else {
                if (delited) {
                    res.status(200).send({ message: "Se elimino con exito", delited });
                } else {
                    res.status(404).send({ message: "Datos nulos como respuesta del servidor" });
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
};
