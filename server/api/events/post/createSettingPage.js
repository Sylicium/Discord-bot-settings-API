
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

    function sendError(message) {
        res.send({
            status: 400,
            message: "Bad request",
            error: message
        })
        return;
    }

    let checkList = [
        { check: "backToEndpointToken", required: true, msg: "No endpoint specified to receive the operation."},
        { check: "settingsWaterfall", required: true, msg: `No settings waterfall specified to generate the page. For examples, please refer to ${config.website.uri.api_documentation}/createPage#settingsWaterfall`}
    ]

    for(let i in checkList) {
        if(!req.body[checkList[i].check] && checkList[i].required) {
            return sendError(checkList[i].msg)
        } else if(req.body.backToEndpointToken) {

        }
    }

    let pageOptions = {
        oneUse: (req.body.oneUse || true),
        backToEndpointToken: req.body.backToEndpointToken,
        settingsWaterfall: [

            {
                name: "Main settings",
                description: "Les paramètres principaux",
                id: "main", // lowercase and one word
                settingType: {
                    type: 2,
                    value: [
                        { placeholder: "Activer le matin", value: "active_1"},
                        { placeholder: "Activer le matin", value: "active_2"},
                    ]
                },
                submenu: [

                ]
            }
        ]
    }



    
    /* {
        oneUse: true,
        name: "",
        token: "Ci9yvyI5rdy046KEZCf2GPmq3VpMugJ9bVBctP4a8UY",
        uri: "http://discordbotsettingsapi/pages/Ci9yvyI5rdy046KEZCf2GPmq3VpMugJ9bVBctP4a8UY",
        creationDatas: {
            name: "main bot",
            username: "uZHBtPDZaHocUA9VAv7qdg",
            createdAt: 1659817225058,
            expiresAt: 1691353227104,
        },
        details: [
            {
                name: "Main settings",
                description: "Les paramètres principaux",
                id: "main", // lowercase and one word
                settingType: {
                    type: 2,
                    value: [
                        { placeholder: "Activer le matin", value: "active_1"},
                        { placeholder: "Activer le matin", value: "active_2"},
                    ]
                },
                submenu: [

                ]
            }
        ]
    }*/





    res.send({
        status: 201,
        message: "Created",
        json: {
            pageURI: "OK",
            pageToken: "ertyiop",
            pageSettings: [

            ],
            oneUse: false,
            backEndpointToken: "zovgikjfhzeioufh"
        },
        request: {
            uri: req.url,
            path: req.path,
            query: req.query,
            method: req.method
        }
    })

}
