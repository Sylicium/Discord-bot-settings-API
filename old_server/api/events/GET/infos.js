/*
const config = require("../../../../config")
const somef = require("../../../../localModules/someFunctions");

const fs = require("fs");
const axios = require('axios')
const fetch = require('node-fetch');
const Logger = new (require("../../../../localModules/logger"))()


module.exports.config = {
    authenticationLevel: 0
}

module.exports.onEvent = (req, res) => {

    res.send({
        status: 200,
        ok: true,
        json: {
            appStatus: "OK",
            serverStatus: "OK",
            tps: "idk lol",
            averageClients: 0
        },
        request: {
            uri: req.url,
            path: req.path,
            query: req.query,
            method: req.method
        }
    })

}
*/

module.exports.config = {
    authenticationLevel: 0
}
module.exports.parameters = [
    { name: "description", required: false, type: "string" }
]
module.exports.body = [
]
module.exports.func = (req, res, Modules_) => {
    res.send({
        status: 200,
        ok: true,
        json: {
            appStatus: "OK",
            serverStatus: "OK",
            tps: "idk lol",
            averageClients: 0
        },
        request: {
            uri: req.url,
            path: req.path,
            query: req.query,
            method: req.method
        }
    })
}