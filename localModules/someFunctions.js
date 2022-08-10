

const fs = require("fs")
const crypto = require("crypto")
let config = require("../config")
const logger = new (require("./logger"))()
var DOMParser = require('dom-parser');
const fetch = require('node-fetch');
const { red } = require("cli-color");


module.exports.shuffle = shuffle
/**
 * f() : Mélange aléatoirement la liste donnée.
 * @param {Array} list - La liste a mélanger
 */
function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
}


module.exports.sum = sum
/**
 * f() : Retourne la somme de tous les éléments de la liste
 * @param {Array} list - La liste en entrée
 */
function sum(list) {
    return list.reduce((partialSum, a) => partialSum + a, 0);
}

module.exports.choice = choice
/**
 * f() : Retourne un élément àléatoire de la liste
 * @param {Array} list - La liste en entrée
 */
function choice(list) {
    return list[Math.floor(Math.random()*list.length)]
}

module.exports.genHex = genHex
/**
 * f() : Retourne une chaine héxadécimale de la longueur voulue
 * @param {Number} length - Longueur de la chaine voulue
 * @param {Boolean} capitalize - Mettre la chaine en caractères majuscule
 */
function genHex(length, capitalize=false) {
    let str = [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return (capitalize ? str.toUpperCase() : str.toLowerCase())
}

module.exports.genbase64 = genbase64
/**
 * f() : Retourne une chaine héxadécimale de la longueur voulue
 * @param {Number} length - Longueur de la chaine voulue
 * @param {Boolean} capitalize - Mettre la chaine en caractères majuscule
 */
function genbase64(length, urlSafe=true) {
    let list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    if(urlSafe) list+="_-"
    else list+="+/"
    list = list.split("")
    return [...Array(length)].map(() => choice(list)).join('');
}

module.exports.genbase64Token = genbase64Token
/**
 * f() : Retourne une chaine héxadécimale de la longueur voulue
 * @param {Number} length - Longueur de la chaine voulue
 * @param {Boolean} capitalize - Mettre la chaine en caractères majuscule
 */
function genbase64Token(tokenSecurityLength) {
    return crypto.randomBytes(tokenSecurityLength).toString('base64');
}

module.exports.any = any
/**
 * f() : Retourne true si au moins 1 élément se trouve dans les 2 listes
 * @param {Array} list - La 1ere liste
 * @param {Array} list_two - La 2ere liste
 * @param {Boolean} caseSensitive - Prendre en compte ou non la casse. Default: true
 */
function any(list, list_two, caseSensitive=true) {
    if(!caseSensitive) {
        list = list.map(f=>{ return f.toLowerCase(); });
        list_two = list_two.map(f=>{ return f.toLowerCase(); });
    }
    for(let i in list) {
        if(list_two.indexOf(list[i]) != -1) return true
    }
    return false
}

module.exports.all = all
/**
 * f() : Retourne true si tous les éléments de la liste A se trouvent dans la B
 * @param {Array} from_list - La liste qui doit être contenue intégralement dans la 2eme
 * @param {Array} list_in - La liste qui doit contenir chaque élement de la 1ere
 * @param {Boolean} caseSensitive - Prendre en compte ou non la casse. Default: true
 */
function all(from_list, list_in, caseSensitive=true) {
    if(!caseSensitive) {
        list = list.map(f=>{ return f.toLowerCase(); });
        list_two = list_two.map(f=>{ return f.toLowerCase(); });
    }
    
    for(let i in from_list) {
        if(list_in.indexOf(from_list[i]) == -1) return false
    }
    return true
}




module.exports.formatDate = formatDate
/**
 * f() : Transforme un timestamp en un texte de date formatée
 * @param {string} timestamp - Le timestamp à convertir
 * @param {string} format - Le format texte à renvoyer (YYYY: year, MM: month, DDDDD: jour de la semaine, DD: day, hh: heure, mm: minute, ss: seconde)
 */
function formatDate(timestamp, format) {
    /*
    YYYY: year
    MM: month
    DDDDD: jour de la semaine
    DD: day
    hh: heure
    mm: minute
    ss: seconde
    */
    let la_date = new Date(timestamp)
    function formatThis(thing, length=2) {
        return `0000${thing}`.substr(-2)
    }

    function getDayName() {
        let list = [
            "lundi",
            "mardi",
            "mercredi",
            "jeudi",
            "vendredi",
            "samedi",
            "dimanche"
        ]
        return list[la_date.getDay()-1]
    }

    let return_string = format.replace("YYYY", la_date.getFullYear()).replace("MM", formatThis(la_date.getMonth()+1)).replace("DDDDD", getDayName()).replace("DD", formatThis(la_date.getDate())).replace("hh", formatThis(la_date.getHours())).replace("mm", formatThis(la_date.getMinutes())).replace("ss", formatThis(la_date.getSeconds()))

    return return_string
}


module.exports.compareString = compareString
/**
 * f() : Renvoie une valeur entre 0 et 1 du taux de similitude entre les deux chaines
 * @param {string} string1 - Première chaine de texte
 * @param {string} string2 - Deuxième chaine de texte
 */
function compareString(string1, string2) {
    // v1.0 from 18/04/2022
    if(string1 == string2) return 1;
    if(string1 == "" || string2 == "") return 0
    let total_count = 0;
    let ok_count = 0;
    for(let longueur_test = 1; longueur_test < string1.length+1; longueur_test++) {
        let morceau;
        for(let multiplier = 0; multiplier <  ((string1.length)/longueur_test)+1; multiplier++ ) {
            let index = longueur_test*multiplier
            if(string1.length > index) {
                total_count++
                let the_string = string1.substr(index, longueur_test)
                if(string2.indexOf(the_string) != -1) {
                    ok_count += 0.5
                } else if(string2.toLowerCase().indexOf(the_string) != -1){
                    ok_count += 0.45
                } else if(string2.indexOf(the_string.toLowerCase()) != -1){
                    ok_count += 0.45
                } else {
                    //logger.log(`No '${the_string}' in '${string2}' `)
                }
            }
            if(string2.length > index) {
                let the_string = string2.substr(index, longueur_test)
                if(string1.indexOf(the_string) != -1) {
                    ok_count += 0.5
                } else if(string1.toLowerCase().indexOf(the_string) != -1){
                    ok_count += 0.45
                } else if(string1.indexOf(the_string.toLowerCase()) != -1){
                    ok_count += 0.45
                } else {
                    //logger.log(`No '${the_string}' in '${string1}' `)
                }
            }
        }

    }

    let a = string1.length
    let b = string2.length

    let ponderation;
    if( (b/a) == 1) {
        ponderation = 1
    } else if( (b/a) > 1 ) {
        ponderation = (a/b)
    } else {
        ponderation = (b/a)
    }

    let score = (ok_count/total_count)*ponderation

    return score
}

module.exports.sleep = sleep
/**
 * f() : Sleep le nombre de milisecondes précisées
 * @param {string} user_id - L'id de l'utilisateur a check
 */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


/**
 * f() : Renvoie le user Discord fetched à partir du code d'auth donné par discord, du scope, et de l'URI de redirection de l'URI d'auth utilisé
 * @param {string} discordAuthCode - Code d'authentification discord, renvoie dans l'URI après avoir accepté l'application
 * @param {string} scope - Type de scope de l'URI (utilisé: identify)
 * @param {string} redirect_uri - URI de redirection que contenais le lien qui a généré le discordAuthCode
 */
module.exports.getUserByDiscordAuthCode = async (discordAuthCode, scope, redirect_uri) => {
    let clientId = config.application.clientId
    let clientSecret = config.application.clientSecret
    let code = discordAuthCode

    logger.debug(discordAuthCode)

    //logger.log(`[somefunction][getUserByDiscordAuthCode] > discordAuthCode: ${discordAuthCode}\nscope: ${scope}\nredirect_uri: ${redirect_uri}`)

    //const fetch = require('node-fetch');


    const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: `${redirect_uri}`,//`https://dirtybiology.captaincommand.repl.co/gift/claim`,
            scope: `${scope}`,//'identify',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    logger.debug("oauthResult",await oauthResult)
    if (await oauthResult.status == "429") {
        logger.warn("[somef.getUserByDiscordAuthCode()] Bot is rate Limited")
        return {
            error: "429"
        }
    }
    let oauthData = await oauthResult.json();
    let userResult = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
    })

    let le_user = await userResult.json()
    return le_user
    /*
    le_user = {
        "id":"316941895395704832",
        "username":"Dokori",
        "avatar":"a_0d14a9d656bdff31eb78e67c2fa5499b",
        "discriminator":"0666",
        "public_flags":256,
        "flags":256,
        "banner":"a_4aab3ae51a56c5a891de9a693877b38b",
        "banner_color":"#f1aeeb",
        "accent_color":15838955,
        "locale":"fr",
        "mfa_enabled":true,
        "premium_type":2
    }

    */
}

/**
 * parseHTMLpart(): retourne le morceau de document html généré à partir du code html donné en texte brut
 * @param {string} string - Code html en texte brut
 * @returns html document
 */
 module.exports.parseHTMLpart = parseHTMLpart
 function parseHTMLpart(string) {
     let DOMparser = new DOMParser(); // DOMparser.parseFromString("string")
     let string2 = `<div class="ZojGHNZkjZOJzcAEJNGZACILkgjhazLCDigjhlibzdfcikbgzakCieeeeeeeeebdhbikhbfIZHKCDFikZAC">${string}</div>`
     //console.log(string2)
     let a = DOMparser.parseFromString(string2, "text/html")
     let b = a.getElementsByClassName("ZojGHNZkjZOJzcAEJNGZACILkgjhazLCDigjhlibzdfcikbgzakCieeeeeeeeebdhbikhbfIZHKCDFikZAC")[0].firstChild
     return b
 }
 /**
  * parseHTML(): retourne le document html ENTIER généré à partir du code html donné en texte brut
  * @param {string} string - Code html en texte brut
  * @returns html document
  */
module.exports.parseHTML = parseHTML
function parseHTML(string) {
    let DOMparser = new DOMParser(); // DOMparser.parseFromString("string")
    //console.log(string2)
    let a = DOMparser.parseFromString(string, "text/html")
    return a
}