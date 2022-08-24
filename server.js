
const config = require("./config")
const somef = require("./localModules/someFunctions");

const cookieParser = require("cookie-parser");
const express = require('express');
const app = express();
app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser());

const serv = require('http').createServer(app);
const io = require('socket.io')(serv);

const fs = require("fs");
const path = require("path")
const axios = require('axios')
const Database_ = require("./localModules/database");
const Logger = new (require("./localModules/logger"))()
const Discord = require("discord.js");
const { off } = require("process");

let DBAPageManager = require("./localModules/DBA_page_manager").DBAPageManager

const Modules_ = {
    "config": config,
    "somef": somef,
    "Database": Database_,
    "Discord": Discord,
    "app": app,
    "axios": axios,
}

let APIEvents = [
]

Logger.info(`[API] Loading APIEvents...`)
fs.readdirSync("./server/api/events/").forEach(directoryName => {
    let dirPath = `./server/api/events/${directoryName}`
    try {
        if( fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory() ) {
            Logger.info(`[API]   Loading api endpoints for method ${directoryName.toUpperCase()}`)
            fs.readdirSync(`./server/api/events/${directoryName}/`).forEach(file => {
                let the_require = require(`./server/api/events/${directoryName}/${file}`)
                the_require.method = directoryName.toUpperCase()
                let fileName = file.split(".")
                fileName.pop()
                fileName = fileName.join(".")
                the_require.endpoint = fileName
                APIEvents.push(the_require)
                Logger.info(`[API]     ✔ Loaded API endpoint (${the_require.method}) /${the_require.endpoint}`)
            })
        } else {
            Logger.info(`[API]   ! ${directoryName} is a file, not a directory`)
        }
    } catch(e) {
        Logger.warn(`[API][ERROR] ❌`,e)
    }

})
Logger.info(`[API] ✅ Loaded ${APIEvents.length} APIEvents`,APIEvents)



module.exports.start = () => {

    let apiEvents = {}

    Logger.info("Chargement des fichiers API") 
    fs.readdirSync("./server/api/events").forEach(endpoint_type => {
        endpoint_type = endpoint_type.toUpperCase()
        if(!apiEvents[endpoint_type]) apiEvents[endpoint_type] = {}
        fs.readdirSync(`./server/api/events/${endpoint_type}`).forEach(file => {
            if(file.endsWith(".js")) {
                let fileName = file.split(".")
                fileName.pop()
                fileName.join(".")
                //require(`./events/${endpoint_type}/${fileName}`).start(bot, endpoint_type)
                let the_require = require(`./server/api/events/${endpoint_type}/${fileName}`)
                apiEvents[endpoint_type][fileName] = the_require
                Logger.info(`[API] Loaded endpoint ${endpoint_type} /api/${fileName}`)
            }
        })
    });
    let dynamicPages = {}
    fs.readdirSync("./server/app").forEach(file => {
        if(file.endsWith(".js")) {
            let fileName = file.split(".")
            fileName.pop()
            fileName.join(".")
            //require(`./events/${endpoint_type}/${fileName}`).start(bot, endpoint_type)
            let the_require = require(`./server/app/${fileName}`)
            dynamicPages[fileName] = the_require
            Logger.info(`[HTML] Loaded dynamic html page /app/${fileName}`)
        }
    })

    // let allEvents = [...Object.keys(apiEvents)]
    Logger.debug(apiEvents)

    /*
    app.all("/api/*", (req, res) => {
        Logger.log(`[API] [${req.ip}] (${req.method}) ${req.url}`)

        // let apiCredentials = somef.checkApiCredentials(req.query.username, req.query.password)
        // if(!apiCredentials.valid) {
        //     res.send({
        //         status: 401
        //         message: "Unauthorized"
        //     })
        // }
        

        last_endpoint = req.path.split("/").pop()
        if(apiEvents[req.method] && apiEvents[req.method][last_endpoint]) {
            
            // if(apiCredentials.authenticationLevel < apiEvents[req.method][last_endpoint].config.authenticationLevel) {
            //     res.send({
            //         status: 403
            //         message: "Forbidden"
            //     })
            // }
            apiEvents[req.method][last_endpoint].onEvent(req,res)
            return;
        } else {
            res.send({
                status: 405,
                message: "Method Not Allowed",
                request: {
                    uri: req.url,
                    path: req.path,
                    query: req.query,
                    method: req.method
                }
            })
        }
    })*/

    
    app.all("/api/*", (req, res) => {        
        let endpoint = req.path.substr(5, req.path.length)
        
        try {
            if(!req.body || config.api.tokens.indexOf(req.body.Authorization) == -1 ) return res.send({
                status: 401,
                message: `Unauthorized.` 
            })
        } catch(e) {
            return res.send({
                status: 401,
                message: `Internal server error. Unauthorized. Cannot process to authentication.`,
                error: `${e}`,
                stack: e.stack.split("\n")
            })
        }

        Logger.debug(`[API] Used Authorization token: ${req.body.Authorization.split("").map((item,index) => { 
            if(index < 10) return item
            else return "*"
        }).join("")}`)
        
        let apiEvent_list = APIEvents.filter((item) => {
            return (endpoint == item.endpoint)
        })
        
        if(apiEvent_list.length == 0) return res.send({
            status: 501,
            message: `No endpoint.` 
        })

        apiEvent_list2 = apiEvent_list.filter((item) => {
            return (item.method == req.method)
        })
        let allMethodsAllowed = apiEvent_list.map((item, index) => {
            return item.method
        })

        if(apiEvent_list2.length == 0) return res.send({
            status: 405,
            message: `Method not allowed`,
            methods: allMethodsAllowed
        })

        let apiEvent = apiEvent_list2[0]

        for(let paramName in req.query) {
            let paramValue = req.query[paramName]
            try {
                Logger.log("paramValue",paramValue)
                if(paramValue.startsWith("[")) {
                    //req.query[paramName] = JSON.parse(JSON.parse(`${JSON.stringify(paramValue)}`))
                    req.query[paramName] = JSON.parse(`${paramValue}`)
                } else {
                    req.query[paramName] = JSON.parse(`${paramValue}`)
                }
            } catch(e) {
                Logger.error(e)
                return res.send({
                    status: 500,
                    message: `Internal server error while parsing to JSON query parameter '${paramName}'.`,
                    error: `${e}`,
                    stack: e.stack.split("\n"),
                    request: { uri: req.url, path: req.path, query: req.query, method: req.method }
                })
            }
        }

        for(let i in apiEvent.parameters) {
            let param = apiEvent.parameters[i]
            if(!req.query[param.name] && param.required) {
                return res.send({
                    status: 400,
                    message: `Bad request. Paramètres manquants: '${param.name}'. ${param.msg || ""}`,
                    parameters: apiEvent.parameters,
                    request: { uri: req.url, path: req.path, query: req.query, method: req.method }
                })
            } else if(req.query[param.name]) {
                try {
                    if(param.type == "array") {
                        if(!Array.isArray(req.query[param.name])) {
                            return res.send({
                                status: 400,
                                message: `Bad request. Type de paramètre invalide: '${param.name}'. ${param.msg || ""}`,
                                parameters: apiEvent.parameters,
                                request: { uri: req.url, path: req.path, query: req.query, method: req.method }
                            })
                        }
                    } else if(typeof req.query[param.name] != param.type) {
                        return res.send({
                            status: 400,
                            message: `Bad request. Type de paramètre invalide: '${param.name}'. ${param.msg || ""}`,
                            parameters: apiEvent.parameters,
                            request: { uri: req.url, path: req.path, query: req.query, method: req.method }
                        })
                    }
                } catch(e) {
                    Logger.error(e)
                    return res.send({
                        status: 500,
                        message: `Internal server error while parsing query parameter '${param.name}' (type:${param.type} | required:${param.required}).`,
                        error: `${e}`,
                        stack: e.stack.split("\n"),
                        request: { uri: req.url, path: req.path, query: req.query, method: req.method }
                    })
                }
            }
        }


        
        if(req.body) {
            /*
            for(let key in req.body) {
                try {
                    if(typeof req.body[key] != "string") continue;
                    req.body[key] = JSON.parse(req.body[key])
                } catch(e) {
                    Logger.error(e)
                    return res.send({
                        status: 500,
                        message: `Internal server error while parsing body key '${key}'.`,
                        error: `${e}`,
                        stack: e.stack.split("\n"),
                        request: { uri: req.url, path: req.path, query: req.query, method: req.method }
                    })
                }
            }*/
            

            
            for(let i in apiEvent.body) {
                let body_param = apiEvent.body[i]
                if(req.body[body_param.name] == undefined && body_param.required) {
                    return res.send({
                        status: 400,
                        message: `Bad request. Paramètres du body manquants: '${body_param.name}'. ${body_param.msg || ""}`,
                        body: apiEvent.body,
                        request: { uri: req.url, path: req.path, query: req.query, body: req.body, method: req.method }
                    })
                } else if(req.body[body_param.name]) {
                    try {
                        if(body_param.type == "array") {
                            if(!Array.isArray(req.body[body_param.name])) {
                                return res.send({
                                    status: 400,
                                    message: `Bad request. Type de paramètre dans le body invalide: '${body_param.name}'. ${body_param.msg || ""}`,
                                    body: apiEvent.body,
                                    request: { uri: req.url, path: req.path, query: req.query, body: req.body, method: req.method }
                                })
                            }
                        } else if(typeof req.body[body_param.name] != body_param.type) {
                            return res.send({
                                status: 400,
                                message: `Bad request. Type de paramètre dans le body invalide: '${body_param.name}'. ${body_param.msg || ""}`,
                                body: apiEvent.body,
                                request: { uri: req.url, path: req.path, query: req.query, body: req.body, method: req.method }
                            })
                        }
                    } catch(e) {
                        Logger.error(e)
                        return res.send({
                            status: 500,
                            message: `Internal server error while parsing body key '${body_param.name}' (type:${body_param.type} | required:${body_param.required}).`,
                            error: `${e}`,
                            stack: e.stack.split("\n"),
                            request: { uri: req.url, path: req.path, query: req.query, body: req.body, method: req.method }
                        })
                    }
                }
            }
            
        }

        apiEvent.func(req, res, Modules_)
        
        return;

    })


    app.get("/assets/*", (req, res) => {
        if(req.path.startsWith("/assets/")) {
            Logger.log(`[assets] Getting ressource: ${req.path}`)
            if(fs.existsSync(`${__dirname}/server/app${req.path}`)) {
                return res.sendFile(`${__dirname}/server/app${req.url}`)
            } else {
                return res.send({
                    status: 404,
                    message: "Ressource unavailable"
                })
            }
        }
    })

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "/server/app/index.html"))
    })
    app.get("/favicon.ico", (req, res) => {
        res.sendFile(path.join(__dirname, "/server/app/assets/img/favicon.ico"))
    })

    app.get("/g/:pageID", async (req, res) => {

        let the_req_headers = req.headers["user-agent"].toLocaleLowerCase()
        let isDiscordRequest = false
        if( (the_req_headers.indexOf("discordbot/") != -1) || (the_req_headers.indexOf("discordapp.com") != -1) ) {
            isDiscordRequest = true
        }

        fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        Logger.log("/g/ fullUrl",fullUrl)
        try {


            if(!isDiscordRequest) {
                if(!req.cookies.connectionToken) {
                    res.cookie("nextRedirectURI",`${fullUrl}`)
                    setTimeout(() => {
                        res.writeHead(307, {Location: config.website.uri.discordAuth.auth.oauth2} );
                        res.end();
                    }, 100)
                    //dynamicPages["discordAuth"].load(req, res)
                    return;
                }
                let isConnected = await Database_.website_isConnected_byConnectionToken(req.cookies.connectionToken)
                if(!isConnected) {
                    res.cookie("nextRedirectURI",`${fullUrl}`)
                    setTimeout(() => {
                        res.writeHead(307, {Location: config.website.uri.discordAuth.auth.oauth2} );
                        res.end();
                    }, 100)
                    return;
                }
            }


            // Database_.tempCommand()

            Logger.log(`[site:settingPages] Request to ${req.path}`)
            Logger.log(`[site:settingPages] 1`, req.params)
            Logger.log(`[site:settingPages] 2`)
    
            function send404() {
                return dynamicPages["404"].load(req, res)
            }
    
            if(!req.params.pageID) { return send404() }
   
            let object = await Database_.loadSettingPage(req.params.pageID)    
            if(!object) { return send404() }
    
            let html = DBAPageManager.createPageHTMLFromPageOptions(object)
                
            res.set('Content-Type', 'text/html');
            res.send(html)
            return;

        } catch(e) {
            Logger.error(e)
        }

    })


    app.get("*", (req, res) => { // TOUJOURS METTRE LE APP GET * a la fin sinon il empeche les autres app.get de se faire
        Logger.log(`[site] Request to ${req.path}`)
        if(req.path == "/") return;
        if(req.url.startsWith("/api/")) return;
        if(req.url.startsWith("/g/")) { return dynamicPages["404"].load(req, res) }
        if(req.path.startsWith("/assets/")) return;
        
        if(fs.existsSync(`${__dirname}/server/app${req.path}.js`)) {
            pageName = req.path.split("/").pop()
            if(dynamicPages[pageName] != undefined) {
                try {
                    dynamicPages[pageName].load(req, res)
                } catch(err) {
                    Logger.error(err)
                    res.send({
                        status: 500,
                        message: `${err}`,
                        stack: err.stack
                    })
                }
            }
        } else if(fs.existsSync(`${__dirname}/server/app${req.path}.html`)) {
            return res.sendFile(`${__dirname}/server/app${req.path}.html`)
        } else {
            return dynamicPages["404"].load(req, res)
        }
    })


    serv.listen(config.server.port, () => {
        Logger.info(`Serveur démarré sur le port ${config.server.port}`)
    })



    io.on('connection', (socket) => {
        Logger.log(`[sock][+] [${socket.id}] Connected.`)

        socket.on('disconnect', (socket) => {
            Logger.log(`[sock][-] [${socket.id}] Disconnected.`)
        })


        socket.on("disconnectAllUsers", datas => {
            if(datas.adminToken == "azertyml") Database_.website_disconnectAllUsers()
        })

        socket.on("checkDiscordAuth", async datas => {
            /*
            datas = {
                connectionToken: connectionToken
            }
            */
            try {

                let isConnected = await Database_.website_isConnected_byConnectionToken(datas.connectionToken)

                if(isConnected) {
                    return socket.emit("checkDiscordAuth", {
                        state: true,
                        connectionToken: datas.connectionToken
                    })
                } else {
                    return socket.emit("checkDiscordAuth", {
                        state: false,
                        connectionToken: "",
                        redirect: config.website.uri.discordAuth.auth.oauth2
                    })
                }

            }catch(e) {
                Logger.warn(e)
                console.log(e)
                return;
            }

        })

        socket.on("discordAuth", async datas => {
            /*
            datas = {
                connectionToken: "",
                discordAuthCode: "",
                nextRedirectURI: ""
            }            
            socket.emit("discordAuth", {
                connectionToken: datas.connectionToken,
                redirect: datas.nextRedirectURI
            })
            */
            try {

                if(!datas) return;

                function redirectToDiscordAuthError(title, message) {
                    socket.emit("discordAuth", {
                        state: false,
                        connectionToken: datas.connectionToken,
                        redirect: `/discordAuthError?title=${title.split(" ").join("%20")}&message=${message.split(" ").join("%20")}`
                    })
                    return;
                }

                let isConnected = await Database_.website_isConnected_byConnectionToken(datas.connectionToken)
                
                if(isConnected) {
                    socket.emit("discordAuth", {
                        state: true,
                        connectionToken: datas.connectionToken,
                        redirect: datas.nextRedirectURI
                    })
                    return;
                }

                let le_user = await somef.getUserByDiscordAuthCode(datas.discordAuthCode, "identify", config.website.uri.discordAuth.auth.redirectURI)
                
                Logger.debug("le_user",le_user)

                if(le_user.error == "429") {
                    redirectToDiscordAuthError("Rate limited","Discord has rate limited our website, please try again later.")
                    return;
                }
                if(!le_user || !le_user.id) {
                    redirectToDiscordAuthError("Undefined user","Cannot find Discord user")
                    return;
                }

                let DatabaseObject = await Database_.website_connectUser(le_user)

                socket.emit("discordAuth", {
                    state: true,
                    connectionToken: DatabaseObject.connectionToken,
                    redirect: datas.nextRedirectURI
                })

                return;

            } catch(e) {
                console.log(e)
                socket.emit("discordAuth", {
                    state: false,
                    connectionToken: datas.connectionToken,
                    redirect: `/discordAuthError?title=Cannot%20process%20to%20login&message=${e}`
                })
            }


        })

        socket.on("sendSettings", async datas => {
            /*
            datas = {
                connectionToken: "token",
                settings: {},
                backToEndpoint: "ab2c23ef2c7d04a"
                backToEndpointUrl: "ab2c23ef2c7d04a"
            }


            return {
                status: 0, 
                message: "AutoLogin failed: Token expired."
            }

            status:
            0: All's good
            1: No datas
            2: Invalid/expired token
            3: Account disabled

            */

            try {



                if(!datas) return Logger.log("[sock][sendSettings] No datas")
                if(!datas.url) {
                    let msg = "Some datas are missing.".split(" ").join("%20")
                    socket.emit("redirect",{ url: `/error?message=${msg}&code=SOCKET_INTEGRITY_FAIL` })
                    return Logger.log("[sock][sendSettings] SOCKET_INTEGRITY_FAIL. Received datas, but some datas are missing")
                }

                let isConnected = false
                let connectedUser = undefined;
                if(datas.connectionToken) {
                    connectedUser = await Database_.website_getConnectedUser_byConnectionToken(datas.connectionToken)
                    isConnected = (connectedUser ? true : false)
                }
                if(!datas.connectionToken || !isConnected) {
                    let msg = "It seems like you are trying to send datas but but you are not connected :/".split(" ").join("%20")
                    socket.emit("redirect",{ url: `/discordAuthError?message=${msg}&title=DISCORD_AUTH_FAIL` })
                    return Logger.log("[sock][sendSettings] DISCORD_AUTH_FAIL. Received datas, but user not connected.")
                }
                



                if(typeof datas["settings"] != "object") Logger.log("[sock][sendSettings] settings is not an object")
                if(datas.url != socket.handshake.headers.referer) {
                    let msg = "Invalid client url provided.".split(" ").join("%20")
                    socket.emit("redirect",{ url: `/error?message=${msg}&code=SOCKET_INTEGRITY_FAIL` })
                    return Logger.log("[sock][sendSettings] SOCKET_INTEGRITY_FAIL. Invalid client url provided.")
                }

                let temp_pageID = socket.handshake.headers.referer.split("/g/")
                if(temp_pageID.length < 2) {
                    let msg = "Invalid pageID provided.".split(" ").join("%20")
                    socket.emit("redirect",{ url: `/error?message=${msg}&code=SOCKET_INTEGRITY_FAIL` })
                    return Logger.log("[sock][sendSettings] SOCKET_INTEGRITY_FAIL. Invalid pageID provided.")
                }
                let pageID = temp_pageID[1]

                let pageSettingInfos = await Database_.loadSettingPage(`${pageID}`)

                if(!pageSettingInfos) {
                    let msg = "Invalid pageID provided.".split(" ").join("%20")
                    socket.emit("redirect",{ url: `/error?message=${msg}&code=SETTING_PAGE_INTEGRITY_FAIL` })
                    return Logger.log("[sock][sendSettings] SOCKET_INTEGRITY_FAIL. Invalid pageID provided.")
                }

                Logger.debug("pageSettingInfos:",pageSettingInfos)

                if(datas.backToEndpointUrl != pageSettingInfos.backToEndpointUrl) {
                    let msg = "Invalid backToEndpointUrl provided.".split(" ").join("%20")
                    socket.emit("redirect",{ url: `/error?message=${msg}&code=SOCKET_INTEGRITY_FAIL` })
                    return Logger.log("[sock][sendSettings] SOCKET_INTEGRITY_FAIL. Invalid backToEndpointUrl provided.")
                }

                axios.put(`${pageSettingInfos.backToEndpointUrl}`, {
                    settings: datas.settings,
                    user: connectedUser.discordUser,
                    backBody: pageSettingInfos.backBody
                }).then(async (response) => {

                    await Database_.deleteSettingPage(pageSettingInfos.id)

                    socket.emit("redirect",{ url: `/expired?message=${"The setting page you previously was on was a one-use page.".split(" ").join("%20")}` })
                    return;
                }).catch(e => {
                    Logger.warn(e)
                    Logger.warn(`Cannot (GET) backToEndpointUrl: '${pageSettingInfos.backToEndpointUrl}' with settings datas.`)
                    socket.emit("redirect",{ url: `/error?message=${"Something went wrong while sending back the settings datas to the application.".split(" ").join("%20")}&code=SEND_BACK_DATAS_PUT_REQUEST_ERROR` })
                    return;
                })


                //socket.emit("sendSettings")
                
                
            } catch(e) {
                Logger.error(e)
            }




        })




    })

}
