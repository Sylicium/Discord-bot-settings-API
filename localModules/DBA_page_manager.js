

const fs = require("fs")
const crypto = require("crypto")
let config = require("../config")
const logger = new (require("./logger"))()
var DOMParser = require('dom-parser');
const fetch = require('node-fetch');
const Database_ = require("./database");
const somef = require("./someFunctions");


let patterns = {
    "waterfallsettings_v2": require("../datas/patterns/settingsPage/v2")
}

class DBAPageManager {
    constructor() {

    }

    createPageHTMLFromPageOptions(pageOptions) {
        /*
        pageOptions = {

        }
        */
        let html = patterns["waterfallsettings_v2"].getHTML()
        let new_html = somef.replaceAllThoses(html, [
            { split: "{{page.name}}", join: pageOptions.pageName},
            { split: "{{page.description}}", join: pageOptions.pageName},
            { split: "{{page.oneUse}}", join: `${pageOptions.oneUse}`},
            { split: "{{page.waterfall}}", join: JSON.stringify(pageOptions.settingsWaterfall)},
        ])
        return new_html
    }
}

module.exports.DBAPageManager = new DBAPageManager()