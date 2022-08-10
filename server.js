
const config = require("./config")
const somef = require("./localModules/someFunctions");

const app = require('express')();
const serv = require('http').createServer(app);
const io = require('socket.io')(serv);

const fs = require("fs");
const path = require("path")
const axios = require('axios')
const fetch = require('node-fetch');
const Database_ = require("./localModules/database");
const Logger = new (require("./localModules/logger"))()



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

    app.all("/api/*", (req, res) => {
        Logger.log(`[API] [${req.ip}] (${req.method}) ${req.url}`)

        /* let apiCredentials = somef.checkApiCredentials(req.query.username, req.query.password)
        if(!apiCredentials.valid) {
            res.send({
                status: 401
                message: "Unauthorized"
            })
        }
        */

        last_endpoint = req.path.split("/").pop()
        if(apiEvents[req.method] && apiEvents[req.method][last_endpoint]) {
            /*
            if(apiCredentials.authenticationLevel < apiEvents[req.method][last_endpoint].config.authenticationLevel) {
                res.send({
                    status: 403
                    message: "Forbidden"
                })
            }*/
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
    app.get("*", (req, res) => {
        Logger.log(`[site] Request to ${req.path}`)
        if(req.path == "/") return;
        if(req.url.startsWith("/api/")) return;
        if(req.path.startsWith("/assets/")) return;
        
        if(fs.existsSync(`${__dirname}/server/app${req.path}.js`)) {
            pageName = req.path.split("/").pop()
            if(dynamicPages[pageName] != undefined) {
                try {
                    dynamicPages[pageName].load(req, res)
                } catch(err) {
                    console.log(err)
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
            return res.sendFile(`${__dirname}/server/app/404.html`)
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

                function redirectToDiscordAuthError(title, message) {
                    socket.emit("discordAuth", {
                        connectionToken: datas.connectionToken,
                        redirect: `/discordAuthError?title=${title.split(" ").join("%20")}&message=${message.split(" ").join("%20")}`
                    })
                    return;
                }

                let isConnected = await Database_.website_isConnected_byConnectionToken(datas.connectionToken)
                
                if(isConnected) {
                    socket.emit("discordAuth", {
                        connectionToken: datas.connectionToken,
                        redirect: datas.nextRedirectURI
                    })
                    return;
                }

                let le_user = await somef.getUserByDiscordAuthCode(datas.discordAuthCode, "identify", config.website.uri.discordAuth.auth.redirectURI)
                
                console.log("le_user",le_user)

                if(!le_user || !le_user.id) {
                    redirectToDiscordAuthError("Undefined user","Cannot find Discord user")
                    return;
                }
                if(le_user.error == "429") {
                    redirectToDiscordAuthError("Rate limited","Discord has rate limited our website, please try again later.")
                    return;
                }

                let DatabaseObject = await Database_.website_connectUser(le_user)

                socket.emit("discordAuth", {
                    connectionToken: DatabaseObject.connectionToken,
                    redirect: datas.nextRedirectURI
                })

                return;

            } catch(e) {
                console.log(e)
                socket.emit("discordAuth", {
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



        })




    })

}
