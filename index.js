

/****************************************/
/*        Garrockk Incredible app       */
/*             Sylicium Corp.           */
/*      Développé par Sylicium#2487     */ 
/*                                      */
/*             Version 1.0.0            */
/*      First update: 02/07/2022        */
/*       Last update: --/--/2022        */
/****************************************/

let inDev = true

const Database = require("./localModules/database")
const MongoClient = require('mongodb').MongoClient;
const logger = new (require("./localModules/logger"))()
const fs = require("fs")
if(inDev) require("dotenv").config()

logger.info("=======================================")
logger.info("========== [Starting script] ==========")
logger.info("=======================================")

let url = process.env.MONGO_URL


let _databaseName = "settings_api"
let scriptName = "DiscordBot Settings API"

logger.info("Tentative de connection à MongoDB...")
MongoClient.connect(url, function(err, Mongo) {
    if(err) throw err
    Database._setMongoClient(Mongo)
    Database._useDb(`${_databaseName}${(inDev ? "_canary" : "")}`)
    logger.info("  Mongo instance connected.")
    _allCode()
})

function _allCode() {

try{

function writeUncaughException(e, title) {
    console.error("[SCRIPT] Uncaught Exception or Rejection",e.stack)
    const fs = require('fs')

    let date = (new Date).toLocaleString("fr-FR")

    if(!title) title = "/!\\ UNCAUGH ERROR /!\\"

    let log_text = `${title} ${e.stack.split("\n").join("\n")}\n`

    //console.log(`[${date} ERROR] (unknown): /!\\ UNCAUGH ERROR /!\\ ${e.stack}`)
    if(!fs.existsSync("./logs/mainUncaugh.log")) {
        fs.writeFileSync("./logs/mainUncaugh.log",`File created on ${date}\n\n`)
    }
    let log_text_split = log_text.split("\n")
    for(let i in log_text_split) {
        fs.appendFileSync("./logs/mainUncaugh.log",`[${date} ERROR] (unknown): ${log_text_split[i]}\n`, 'utf8');
    }
}

/* Importation des modules */
/**/
const { Client, MessageEmbed, Collection } = require('discord.js');
const config = require('./config');
//const commands = require('./help');
const fs = require('fs')

process
  .on('unhandledRejection', (reason, p) => {
    console.log(reason, `[${scriptName}] Unhandled Rejection at Promise`, p);
    writeUncaughException(reason, "Unhandled Rejection (process.on handle)")
  })
  .on('uncaughtException', err => {
    console.log(err, `[${scriptName}] Uncaught Exception thrown`);
    writeUncaughException(err, "Uncaught Exception (process.on handle)")
  });

// the asynchronous or synchronous code that emits the otherwise uncaught error


process.on('exit', function(code) {
    logger.error(`About to exit with code ${code}\n`);

    if(code == 0) {
        logger.log(`Le script s'est terminé normalement, par le code 0.`)
    }
});

//console.log = () => {throw new Error("ARRETE D'UTILISER LE CONSOLE.LOG T'AS DEV UN MODULE LOGGER C PAS POUR RIEN")}



logger.info("Starting all modules...")

/* Importation des scripts locaux */
/**/
let somef = require("./localModules/someFunctions")

let server = require("./server")
server.start()


setTimeout(async () => {
    logger.info("info")
    logger.warn("warn")
    logger.error("error")
    logger.log("log")
    logger.debug("debug")
}, 2000)





} catch(e) {

    writeUncaughException(e)

}

}
