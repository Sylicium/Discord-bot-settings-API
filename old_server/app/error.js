
let config = require("../../config")
const somef = require("../../localModules/someFunctions")


let Pattern = `<html>

<head>
	<title>
		${config.website.title} | Error
	</title>
	<meta charset="utf-8">
	<meta property="og:title" content="${config.website.title} Error">
	<meta property="og:description" content="{{message}}{{br}}{{code}}">

</head>

<body>

    <h1>An error occured</h1>
    <p>You have been redirected here because an error occured:</p>
    <h2>{{message}}</h2>
    <h2>{{code}}</h2>

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
        { s: "message", j: (req.query.message || "No reason specified")},
        { s: "code", j: (req.query.code || "No code specified")},
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