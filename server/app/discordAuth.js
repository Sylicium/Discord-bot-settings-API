
let config = require("../../config")
const somef = require("../../localModules/someFunctions")


let Pattern = `<html>

<head>
	<title>
		Discord Auth Page
	</title>
	<meta charset="utf-8">
	<meta property="og:title" content="Discord Authentication">
	<meta property="og:description" content="Please connect to your discord account to continue">

</head>

<body>

    <h1>Discord Authentication</h1>
    <p>Authenticating...</p>

	<div class="main" bis_skin_checked="1">
		<h2 class="title_text">Authenticating...</h2>
        <button id="retry_button" onclick="redirectToOauth()" hidden="">Réessayer</button>
	</div>


</body>
<style>


body {
	background-color: #36393F;
	color: #FFFFFF;
	font-family: consolas;
	overflow: hidden;
}
div.main {
	max-width: 600px;
	background-color: #2B2D30;
	border-radius: 10px;
	text-align: center;
	padding: 10px;
	box-shadow: 1px 1px 30px #222222;
	margin: 0px auto;
	margin-top: 50vh;
	transform: translateY(-50%);
}	

</style>


<script src="/socket.io/socket.io.js"></script>
<script src="/assets/script/basicFunctions.js"></script>
<script>


    function redirectToOauth() {
        window.location.href = "${config.website.uri.discordAuth.auth.oauth2}"
    }
    

    let ServerResponded = false

    let DiscordAuthCode = ""
	window.onload = () => {

        // "https://dirtybiology.captaincommand.repl.co/auth?error=access_denied&error_description=The+resource+owner+or+authorization+server+denied+the+request"


        //return setMsg("L'authentification est impossible maintenant car le site est en maintenance jusqu'à 23h00")
                
        let the_code = decodeURI(document.location.href).split("?code=")[1]
        if(the_code != undefined) the_code = the_code.split("&")[0]
        console.log("DiscordAuthCode:",the_code)
        let DiscordAuthCode = the_code
        
        let the_error = decodeURI(document.location.href).split("?error=")[1]
        if(the_error != undefined) the_error = the_error.split("&")[0]
        console.log("the_error:", the_error)

        if(the_error == "access_denied") {

            setMsg("L'utilisateur a refusé la connection. cliquez ci dessous pour reesayer.")
            document.getElementById("retry_button").hidden = false
            return;
        }

        let datas_to_send = {
            connectionToken: getCookie("connectionToken"),
            discordAuthCode: DiscordAuthCode,
            nextRedirectURI: getCookie("nextRedirectURI"),
        }

        socket.emit("discordAuth", datas_to_send)
        
        setTimeout(() => {
            if(!ServerResponded) {
                setMsg("[error] Server not responded in time.")
                /*setTimeout(() => {
                    makeRedirect()
                }, 3000)*/
            }
        }, 5000)
	};


    socket.on("discordAuth", datas => {
        /*
        datas = {
            connectionToken: datas.connectionToken,
            redirect: datas.nextRedirectURI or error page
        }
        datas = {
            state: 0,
            message: "response msg"
            connectionToken: "connection token",
            forceRedirect: false/url
        }
        return codes:
        0: Authentication succeed (by connectionToken or discordAuthCode)
        1: Invalid datas were sent
        2: Invalid connectionToken or discordAuthCode
        3: Session expired
        4: Rate limited

        */
        ServerResponded = true

        if(!datas) return;

        if(datas.connectionToken) {
            setCookie("connectionToken",datas.connectionToken)
        }

        let uri = getCookie("nextRedirectURI")
        return makeRedirect((uri ? uri : datas.redirect))

        
        if(datas.state == "0") {
            setMsg("Auth succeed.")
            setCookie("connectionToken",datas.connectionToken,7)

            setTimeout(() => {
                makeRedirect()
            }, 100)
        } else if(datas.state == "1") {
            setMsg(\`Auth failed [code \${datas.state}] \${datas.message || ""}\`)
            setCookie("connectionToken",datas.connectionToken,7)
            if(datas.forceRedirect) {
                setTimeout(() => {
                    document.location.href = datas.forceRedirect
                }, 200)
            }
        } else if(datas.state == "2") {
            setMsg(\`Auth failed [code \${datas.state}] \${datas.message || ""}\`)
            setCookie("connectionToken",datas.connectionToken,7)
            if(datas.forceRedirect) {
                setTimeout(() => {
                    document.location.href = datas.forceRedirect
                }, 200)
            }
        } else if(datas.state == "3") {
            setMsg(\`Auth failed [code \${datas.state}] \${datas.message || ""}\`)
            setCookie("connectionToken",datas.connectionToken,7)
            if(datas.forceRedirect) {
                setTimeout(() => {
                    document.location.href = datas.forceRedirect
                }, 200)
            }
        } else {
            console.log("[server] Authentication error:",datas.message)
            setCookie("connectionToken", "",0)
            
            setMsg(\`[server] Authentication error [code \${datas.state}]: \${datas.message}. Redirecting in 10s.\`)
            
            if(!!datas.forceRedirect) {
                setTimeout(() => {
                    document.location.href = datas.forceRedirect
                }, 200)
            } else {
                setTimeout(() => {
                    makeRedirect()
                }, 10000)
            }
        }

    })


    function setMsg(text) {
        document.getElementsByClassName("title_text")[0].textContent = text
    }
    
    function makeRedirect(redirect_uri) {
        if(redirect_uri.length >= 10) {
            setCookie("nextRedirectURI", "",0)
            setTimeout(() => { document.location.href = redirect_uri }, 100)
        } else {
            setCookie("nextRedirectURI", "",0)
            setTimeout(() => { document.location.href = document.location.origin }, 100)
        }
    }



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