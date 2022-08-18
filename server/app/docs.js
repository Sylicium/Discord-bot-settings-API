
let config = require("../../config")
const somef = require("../../localModules/someFunctions")


let Pattern = `
<html>

<head>
	<title>
		Discord Bot Settings API | Documentation
	</title>
	<meta charset="utf-8">
	<meta property="og:title" content="Discord Bot Settings API | Documentation">
	<meta property="og:description" content="The Documentation of our API to easily create settings page for your discord bot.">
    <link rel="stylesheet" href="/assets/style/waterfall.css">
    <link rel="stylesheet" href="/assets/style/discordSwitchButtons.css">
    <link rel="stylesheet" href="/assets/style/discordRadioButtons.css">
    <link rel="stylesheet" href="/assets/style/discordSliders.css">
    <link rel="stylesheet" href="/assets/style/discordColors.css">
    <link rel="stylesheet" href="/assets/style/global.css">
    <link rel="stylesheet" href="/assets/style/docs.css">

</head>

<body>

    <h1>Documentation</h1>
    <h2>Version 1.0.0</h2>
    <h2>Pas encore de Documentation.</h2>

	<div class="endpoint_list">
        <div class="endpoint bloc">
            <div class="endpoint_url">${config.api.url}/*</div>
            <div class="endpoint_description">Tous les endpoints. Vous aurez besoin d'un token d'api pour utiliser l'api dans cette version.</div>
            <div class="endpoint_parameters">[]</div>
            <div class="endpoint_body">{ Authorization: "<API_TOKEN>"}</div>
        </div>
	</div>


	

</body>
<style>



</style>


<script src="/socket.io/socket.io.js"></script>
<script src="/assets/script/basicFunctions.js"></script>
<script>


</script>

</html>`
module.exports.Pattern = Pattern


module.exports.load = load
function load(req, res) {

    let splitList = [
        { s: "br", j: "<br>"},
    ]

    let pageObjectString = Pattern
    for(let i in splitList) {
        pageObjectString = pageObjectString.split(`{{${splitList[i].s}}}`).join(splitList[i].j)
    }

    let pageObject = somef.parseHTML(pageObjectString)
    pageObject = pageObjectString
    //res.sendFile(pageObject)
    
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':pageObject.length});
    res.write(pageObject);
    res.end();

    return;
}



