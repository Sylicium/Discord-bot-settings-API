
const config = require("../../../../config")
const Logger = new (require("../../../../localModules/logger"))()

module.exports.config = {
    authenticationLevel: 0
}
let parameters = [
    /*
    { name: "description",          required: false,    type: "string" },
    { name: "pageName",             required: true,     type: "string" },
    { name: "pageDescription",      required: true,     type: "string" },
    { name: "backToEndpointToken",  required: true,     type: "string" },
    { name: "backToEndpointUrl",    required: true,     type: "string" },
    { name: "settingsWaterfall",    required: true,     type: "string", msg: `For waterfall settings examples, please refer to ${config.website.uri.api_documentation}/createPage#settingsWaterfall`},
    { name: "oneUse",               required: true,     type: "boolean", msg: "In this API version oneUse must be set to true."},
    */
]
module.exports.parameters = parameters

let body = [
]
module.exports.body = body


module.exports.func = async (req, res, Modules_) => {
    try {

        Logger.warn("(PUT) back: req.body",req.body)
        Logger.warn("(PUT) back: req.query",req.query)
        
        res.send({
            status: 200,
            message: "OK",
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
            message: "Internal server error.",
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