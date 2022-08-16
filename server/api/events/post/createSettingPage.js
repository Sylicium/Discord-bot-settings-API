
const config = require("../../../../config")
const somef = require("../../../../localModules/someFunctions");

const fs = require("fs");
const axios = require('axios')
const fetch = require('node-fetch');
const Logger = new (require("../../../../localModules/logger"))()
const Database_ = require("../../../../localModules/database")


module.exports.config = {
    authenticationLevel: 0
}

module.exports.onEvent = (req, res) => {

    try {

        function sendError(message) {
            res.send({
                status: 400,
                message: "Bad request",
                error: message
            })
            return undefined
        }

        let checkList = [
            { check: "pageName", required: true, msg: "No page name specified."},
            { check: "pageDescription", required: true, msg: "No page description specified."},
            { check: "backToEndpointToken", required: true, msg: "No endpoint TOKEN specified to receive the operation."},
            { check: "backToEndpointUrl", required: true, msg: "No endpoint URL specified to receive the operation."},
            { check: "settingsWaterfall", required: true, msg: `No settings waterfall specified to generate the page. For examples, please refer to ${config.website.uri.api_documentation}/createPage#settingsWaterfall`},
            { check: "oneUse", required: true, msg: "No page description specified."},
        ]

        if(!req.body) return sendError("No body specified.")

        for(let i in checkList) {
            if(!req.body[checkList[i].check] && checkList[i].required) {
                return sendError(checkList[i].msg)
            } else if(req.body.backToEndpointToken) {

            }
        }

        if(!req.body["oneUse"] || req.body["oneUse"] != true) {
            res.send({
                status: 400,
                message: "Bad request",
                error: `In this version you can only make oneUse page. Please add oneUse=true to your request`
            })
            return;
        }

        let pageOptions = {
            oneUse: (req.body.oneUse || true),
            token: somef.genbase64(64,true,true),
            backToEndpointToken: req.body.backToEndpointToken,
            backToEndpointUrl: req.body.backToEndpointUrl,
            pageName: req.body.pageName,
            pageDescription: (req.body.pageDescription || ""),
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


        let html = ""

        let page = fs.readFileSync("./datas/patterns/settingsPage/v2.html","utf-8")

        

        
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
                oneUse: false,
                backEndpointToken: "zovgikjfhzeioufh",
                waterfallSettings: [

                ],
                HTML: page
            },
            request: {
                uri: req.url,
                path: req.path,
                query: req.query,
                method: req.method
            }
        })

    } catch(e) {
        console.log(e)
        res.send({
            status: 500,
            message: "Internal server error",
            error: `${e}`,
            stack: e.stack.split("\n"),
            json: false,
            request: {
                uri: req.url,
                path: req.path,
                query: req.query,
                method: req.method
            }
        })
    }

}
