
let config = require("../../config")
const somef = require("../../localModules/someFunctions")


let Pattern = `<html>

<head>
	<title>
		${config.website.title} | 404 Not found
	</title>
	<meta charset="utf-8">
	<meta property="og:title" content="${config.website.title} | 404 Not found">
	<meta property="og:description" content="This page does not exists.">
    <meta name="theme-color" content="#F25858">

</head>

<body>

    <h1>404 Not found</h1>
    <p>Can't found this page on server</p>

    <a class="link" href="/">Click here to go back to the main page.</a>

</body>
<style>

body {
    background-color: #36393F;
    color: whitesmoke;
    font-family: consolas;
}

.red {
    color: red
}
.underline {
    text-decoration: underline;
}

.link {
    color: cyan;
    text-decoration: none;
}
.link:hover {
    color: cyan;
    text-decoration: underline;
}
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
        { s: "error.title", j: (req.query.title || "UndefinedError")},
        { s: "error.message", j: (req.query.message || "UndefinedErrorDescription")},
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