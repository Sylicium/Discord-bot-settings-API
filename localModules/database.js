const { info } = require("console")
const somef = require("./someFunctions")

const logger = new (require("./logger"))()
//const MongoClient = require('mongodb').MongoClient;

// v1.0.0 - 24/04/2022


/*function getdb() {
    db = MongoClient.connect(url, function(err, Mongo) {
        if(err) throw err
        TheMongoInstance = Mongo
        logger.debug("set mongo instance.")
    })
    return new Database(TheMongoInstance);
    
}*/


class Database {
    constructor() {
        this.Mongo = undefined
        this._usedDataBaseName = undefined
        this._botInstance = undefined
    }

    _setMongoClient(the_mongo) {
        this.Mongo = the_mongo
        logger.debug("MongoClient singleton set.")
    }

    _useDb(DbName) {
        return this._usedDataBaseName = DbName
    }

    _setBotInstance_(bot) {
        this._botInstance = bot
    }

    async getAccountByID(identifiant) {
        return this.Mongo.db(this._usedDataBaseName).collection("accounts").findOne({id:identifiant})
    }
    async findAccount(search_params) {
        return this.Mongo.db(this._usedDataBaseName).collection("accounts").findOne(search_params)
    }
    async findAccounts(search_params) {
        return this.Mongo.db(this._usedDataBaseName).collection("accounts").find(search_params).toArray()
    }


    //async register(botID, applicationID, endpoints=[], accountInfos) {
    async register(username, password, identity={}, informations={}) {
        /*
        username: username,
        password: password,
        id: "rand hex"
        identity: {
            firstname: "prénom",
            name: nom de famille,
            age: "25"
        },
        informations = {
            mail: "example@gmail.com",
            tel: "0123456789",
        },
        settings: {
            // private: false,
            disabledAccount: false,
            enpoints: [
                { permanent: false, expireAt: 1691349879999, name: "main endpoint", endpointID: "ab2c23ef2c7d04a", url: "https://dirtybiology.captaincommand.repl.co/api/back"} 
            ], 
            // -1 for no expires, max 3 endpoints permanent | Max expire time = 3 years | Total endpoints simultanéously: 100 (except pernanent endpoints, so max 103 endpoints)
        }

        */

        let pattern = {
            id: somef.genHex(16),
            username: username,
            password: password,
            accountID: somef.genbase64(32, true, true),
            identity: {
                firstname: identity.firstname,
                name: identity.name,
                age: identity.age
            },
            informations: {
                mail: informations.mail,
                tel: informations.tel,
            },
            settings: {
                // private: false,
                disabledAccount: false,
                enpoints: [
                    // { permanent: false, expireAt: 1691349879999, requireDiscordLogin: true, name: "main endpoint", endpointID: "ab2c23ef2c7d04a", url: "https://dirtybiology.captaincommand.repl.co/api/back"} 
                    // { owner: "accountID", endpointID: "ab2c23ef2c7d04a" } 
                ],
                // -1 for no expires, max 3 endpoints permanent | Max expire time = 3 years | Total endpoints simultanéously: 100 (except pernanent endpoints, so max 103 endpoints)
                access: [
                    /*
                    { accessAccountID: "38fa0b22", name: "main bot", username: "uZHBtPDZaHocUA9VAv7qdg", password: "fUeW8l3SDH94d-xb7Nva8dcP41Pck908SG7TtWMTiqq2G9To1_zoxxGTEwf991O89h8jqM5m3HZkrBL2CbQRrg", permissions: {
                        createPermanentEndpoints: false,
                        createTemporaryEndpoints: true,
                        maxTemporaryEndpointExpiration: 1000*3600*24, // in ms
                        disabled: false,
                        allowedIPadresses: [
                            "127.0.0.1",
                            "0.0.0.0:0"
                        ]
                    }}
                    */
                ],
                activePages: [

                    /*
                    {
                        token: "token de la page",
                        author: {
                            accessAccountID: "38fa0b22",
                            username: "acces author username",
                            password: "access author password"
                        }
                    }
                    */
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
                ]
            }
        }

        /*

        settingType:
        0 : Nothing
        1 : Boolean button
        2 : Select list
        3 : Text input
        4 : Integer input
        5 : Float input

        IF SUBMENU, settingType autoSet to Boolean and setting returns false or the subsetting datas

        Examples:
        { type: 0 }
        { type: 1, value: true/false }
        {
            type: 2,
            value: [
                { placeholder: "Activer le matin", value: "active_1"},
                { placeholder: "Activer le matin", value: "active_2"},
            ]
        }
        {
            type: 3,
            value: { placeholder: "Message de bienvenue", value: "" } // value="" show placeholder, if value, value is the default value of the text area
        }
        {
            type: 4,
            value: { placeholder: "Niveau pour obtenir le role", value: null/NaN } // value=null or NaN show placeholder, if value is a number, 0 included, value is the default value of the text area
        }
        {
            type: 5,
            value: { placeholder: "Niveau pour obtenir le role", value: null/NaN } // value=null or NaN show placeholder, if value is a float, 0 included, value is the default value of the text area
        }

        */
        // page.deleteAfterUse = true or useOnce, ou en gros quand on a confirmé l'envoie ça supprime la page avec le token de l'URL
        
        
        await this.Mongo.db(this._usedDataBaseName).collection("accounts").insertOne(pattern)

        return pattern

    }


    async website_disconnectExpiredUsers() {
        let now = Date.now()
        await this.Mongo.db(this._usedDataBaseName).collection("connected_users").deleteMany( { "expiresAt": { $lt: now } } )
    }

    async website_disconnectAllUsers() {
        // clear de account.app.connectionTokens
        logger.warn("[website] Disconnecting all Users.")
        await this.Mongo.db(this._usedDataBaseName).collection("connected_users").deleteMany( { } )

    }
    async website_connectUser(discordUser) {
        // clear de account.app.connectionTokens

        this.website_disconnectExpiredUsers()

        let connectionToken = somef.genbase64Token(64)

        let json = {
            connected: true,
            connectionToken: connectionToken,
            connectedAt: Date.now(),
            expiresAt: (Date.now()+1000*3600*24*31),
            discordUser: {
                tag: discordUser.tag,
                username: discordUser.username,
                discriminator: discordUser.discriminator,
                id: discordUser.id,
                locale: discordUser.locale,
                banner: discordUser.banner,
                avatar: discordUser.avatar,
                mfa_enabled: discordUser.mfa_enabled || null,
                accent_color: discordUser.accent_color || null,
                flags: discordUser.flags,
                premium_type: discordUser.premium_type,
                public_flags: discordUser.public_flags,
                system: discordUser.system,
            }
        }
        await this.Mongo.db(this._usedDataBaseName).collection("connected_users").insertOne(json) 

        return json
        
    }
    async website_isConnected_byConnectionToken(connectionToken) {
        this.website_disconnectExpiredUsers()
        let now = Date.now()
        let object = await this.Mongo.db(this._usedDataBaseName).collection("connected_users").findOne({
            "connectionToken": connectionToken,
            "expiresAt": { $gt: now },
            "connected": true
        })
        return (object ? true : false)
    }

    async getBackEndpointURI_byApplicationToken(token) {

    }

    async createSettingPage(pageOptions, accountID) {
        /*
        pageInfos = {

        }
        */
        let json = {
            accountID: accountID,
            pageToken: somef.genbase64(64, true)
        }
        await this.Mongo.db(this._usedDataBaseName).collection("setting_pages").insertOne(json)
        return json
    }

    async loadSettingPage(pageID) {
        let object = await this.Mongo.db(this._usedDataBaseName).collection("setting_pages").findOne({
            "id": pageID
        })
        return (object ? object : false)
    }


    async tempCommand() {

        try {

            let json = {
                oneUse: true,
                id: somef.genbase64(64,true),
                backToEndpointToken: "AAAAbacktotoken",
                backToEndpointUrl: "AAAAbacktourl",
                pageName: "PageNameDirtyBiologistan",
                pageDescription: "PageDescription hello",
                settingsWaterfall: [
                    {
                        name: "Paramètres généraux",
                        description: "Paramètres généraux",
                        id: "main", // lowercase and one word
                        submenu: [
                            {
                                name: "Activer le bot ou non",
                                description: "Permet d'activer si besoin le bot et de le désactiver",
                                id: "active", // lowercase and one word
                                settingType: {
                                    type: 1,
                                    value: true
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Activer le bot ou non",
                                description: "Permet d'activer si besoin le bot et de le désactiver",
                                id: "1", // lowercase and one word
                                settingType: {
                                    type: 1,
                                    value: false
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Activer le bot ou non",
                                description: "Permet d'activer si besoin le bot et de le désactiver",
                                id: "2", // lowercase and one word
                                settingType: {
                                    type: 1,
                                    value: false
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Activer le bot ou non",
                                description: "Permet d'activer si besoin le bot et de le désactiver",
                                id: "3", // lowercase and one word
                                settingType: {
                                    type: 1,
                                    value: true
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Activer le bot ou non",
                                description: "Permet d'activer si besoin le bot et de le désactiver",
                                id: "4", // lowercase and one word
                                settingType: {
                                    type: 1,
                                    value: false
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Auto redémarrage",
                                description: "Redémarrer ou non automatiquement le bot",
                                id: "restart", // lowercase and one word
                                settingType: {
                                    type: 1,
                                    value: true
                                },
                                submenu: [
                                    {
                                        name: "",
                                        description: "Lundi",
                                        id: "lundi", // lowercase and one word
                                        settingType: {
                                            type: 1,
                                            value: false
                                        }
                                    },
                                    {
                                        name: "",
                                        description: "Mardi",
                                        id: "mardi", // lowercase and one word
                                        settingType: {
                                            type: 1,
                                            value: false
                                        }
                                    },
                                    {
                                        name: "",
                                        description: "Mercredi",
                                        id: "mercredi", // lowercase and one word
                                        settingType: {
                                            type: 1,
                                            value: false
                                        },
                                        submenu: [
                                            {
                                                name: "",
                                                description: "Mardi",
                                                id: "mardi", // lowercase and one word
                                                settingType: {
                                                    type: 8,
                                                    value: { min: 1, max: 255, step: 1}
                                                }
                                            },
                                            {
                                                name: "",
                                                description: "Mercredi",
                                                id: "mercredi", // lowercase and one word
                                                settingType: {
                                                    type: 1,
                                                    value: false
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        name: "",
                                        description: "Jeudi",
                                        id: "jeudi", // lowercase and one word
                                        settingType: {
                                            type: 1,
                                            value: false
                                        }
                                    },
                                    {
                                        name: "",
                                        description: "Vendredi",
                                        id: "vendredi", // lowercase and one word
                                        settingType: {
                                            type: 1,
                                            value: false
                                        }
                                    },
                                    {
                                        name: "",
                                        description: "Samedi",
                                        id: "samedi", // lowercase and one word
                                        settingType: {
                                            type: 1,
                                            value: false
                                        }
                                    },
                                    {
                                        name: "",
                                        description: "Dimanche",
                                        id: "dimanche", // lowercase and one word
                                        settingType: {
                                            type: 1,
                                            value: false
                                        }
                                    },
                                ]
                            },
                            {
                                name: "Mon animal",
                                description: "Choisir votre animal",
                                id: "selectsheep", // lowercase and one word
                                settingType: {
                                    type: 2,
                                    required: true,
                                    selected: 1,
                                    value: [
                                        { name: "-- Choose element --", value:""},
                                        { name: "One sheep", value:"sheep"},
                                        { name: "A Creeper", value:"creeper"},
                                    ]
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Couleurs de base",
                                description: "Choisir la couleur de base parmis les 3",
                                id: "basecolor", // lowercase and one word
                                settingType: {
                                    type: 3,
                                    selected: 1,
                                    value: [
                                        { name: "Red", value:"red"},
                                        { name: "Green", value:"green"},
                                        { name: "Blue", value:"blue"},
                                    ]
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Message de bienvenue",
                                description: "Message envoyé aux nouveaux membres",
                                id: "welcomemsg", // lowercase and one word
                                settingType: {
                                    type: 4,
                                    required: true,
                                    value: { placeholder: "Message de bienvenue", value:"Bienvenue à toi @user !"}
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Jours dans le mois",
                                description: "Régler le nombre de jours par mois",
                                id: "number1", // lowercase and one word
                                settingType: {
                                    type: 6,
                                    required: true,
                                    value: 4 // undefined
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Slider",
                                description: "Message envoyé aux nouveaux membres",
                                id: "slider1", // lowercase and one word
                                settingType: {
                                    type: 8,
                                    required: true,
                                    selected: 4,
                                    value: { min: 1, max: 5, step: 1}
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Slider",
                                description: "Message envoyé aux nouveaux membres",
                                id: "slider2", // lowercase and one word
                                settingType: {
                                    type: 8,
                                    required: true,
                                    selected: 35,
                                    value: { min: 7, max: 100, step: 1}
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Délai entre les messages",
                                description: "Le nombre de seconde à attendre entre l'envoie de chaque messages.",
                                id: "slider3", // lowercase and one word
                                settingType: {
                                    type: 8,
                                    required: true,
                                    selected: 5.234,
                                    value: { min: 1.3, max: 10, step: 0.001}
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Délai entre les messages",
                                description: "Le nombre de seconde à attendre entre l'envoie de chaque messages.",
                                id: "zefzefzefzef", // lowercase and one word
                                settingType: {
                                    type: 8,
                                    required: true,
                                    selected: 64,
                                    value: { min: 1, max: 255, step: 1}
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Slider",
                                description: "Message envoyé aux nouveaux membres",
                                id: "switch1", // lowercase and one word
                                settingType: {
                                    type: 1,
                                    required: true,
                                    selected: true,
                                    value: false
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Textarea",
                                description: "Messages de bienvenue",
                                id: "welcomemsg2", // lowercase and one word
                                settingType: {
                                    type: 1,
                                    required: true,
                                    selected: true,
                                    value: { placeholder: "Message de bienvenue", value:"Bienvenue à toi @user !"}
                                },
                                submenu: [
                        
                                ]
                            }
                        ]
                    },
                    {
                        name: "coucou",
                        id: "main2",
                        submenu: [
                            {
                                name: "Délai entre les messages",
                                description: "Le nombre de seconde à attendre entre l'envoie de chaque messages.",
                                id: "zefzefzefzef", // lowercase and one word
                                settingType: {
                                    type: 8,
                                    required: true,
                                    selected: 64,
                                    value: { min: 1, max: 255, step: 1}
                                },
                                submenu: [
                        
                                ]
                            },
                            {
                                name: "Slider",
                                description: "Message envoyé aux nouveaux membres",
                                id: "switch1", // lowercase and one word
                                settingType: {
                                    type: 1,
                                    required: true,
                                    selected: true,
                                    value: false
                                },
                                submenu: [
                        
                                ]
                            }
                        ]
                        
                    }
                ]
            }
    
            await this.Mongo.db(this._usedDataBaseName).collection("setting_pages").insertOne(json)
        } catch(e) {
            console.log(e)
        }
    }



}


let Database_ = new Database()

module.exports = Database_
