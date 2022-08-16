
let config = require("../../config")
const somef = require("../../localModules/someFunctions")


let Pattern = `<html>

<head>
	<title>
		${config.website.title} | Page expired
	</title>
	<meta charset="utf-8">
	<meta property="og:title" content="${config.website.title} Discord Auth Error">
	<meta property="og:description" content="{{error.title}}{{br}}{{error.message}}">

</head>

<body>

    <h1>This page expired</h1>
    <p>The page you previously were on has expired.</p>
    <h2>{{message}}</h2>

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
    color: whitesmoke;
    text-decoration: none;
}
.link:hover {
    color: white;
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
        { s: "message", j: (req.query.message || "No reason specified")},
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