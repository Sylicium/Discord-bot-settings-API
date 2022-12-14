


let html_page = `<html>

<head>
	<title>
    {{config.website.title}} | {{page.name}}
	</title>
	<meta charset="utf-8">
    
	<meta property="og:site_name" content="Discord Bot Settings API">
	<meta property="og:title" content="{{config.website.title}}">
	<meta property="og:description" content="{{settings.description}}">
    <meta name="theme-color" content="#586DF2">

    <link rel="stylesheet" href="/assets/style/discordColors.css">
    <link rel="stylesheet" href="/assets/style/global.css">
    <link rel="stylesheet" href="/assets/style/waterfall.css">
    <link rel="stylesheet" href="/assets/style/discordSwitchButtons.css">
    <link rel="stylesheet" href="/assets/style/discordRadioButtons.css">
    <link rel="stylesheet" href="/assets/style/discordSliders.css">

</head>

<body>

    <div id="toasts"></div>
    <div id="pleaseconnect" class="fullPageCentered noselect" hidden>
        <div class="centered" id="loading_page_text">
            Loading settings page ...
        </div>
    </div>

    <h1>{{page.name}}</h1>
    
    <div id="mainbox" class="noselect">
  
    </div>


    <div id="saving" class="fullPageCentered noselect" hidden>

        <div class="centered">
            Envoie des données à l'application {{page.name}}
        </div>


    </div>
    
    
    <div id="confirm_button" class="noselect confirm_button">
        <div class="centered">
            <div class="padded carefultext">Careful - you have unsaved changes!</div>
            
            <div class="buttons padded">

                <!-- <div>
                    <button id="button_settings_discard_changes" onclick="_settings_reset_default()">Reset as first open</button>
                </div> -->
                 <div>
                    <button id="button_settings_save_changes" onclick="_settings_send_datas()">Send changes</button>
                </div>
            </div>

        </div>

    </div>
     

    <div id="contents_diverged" class="noselect opened">
        <div class="centered">
            <div class="padded carefultext">Contents diverged from the original page</div>
            
            <div class="buttons padded">

                <div>
                    <button id="button_settings_discard_changes" onclick="_settings_reset_default()">Reset as original page</button>
                </div>
            </div>

        </div>

    </div>

</body>
<style>


</style>



<script src="/socket.io/socket.io.js"></script>
<script src="/assets/script/basicFunctions.js"></script>    
<script src="/assets/script/waterfall_v2.js"></script>
<script>


let pageInfos = {
    oneUse: {{page.oneUse}},
    waterfallSettings: {{page.waterfall}},
    backToEndpointUrl: {{page.backToEndpointUrl}},
}


window.onload = () => {

    /*socket.emit("checkDiscordAuth", {
        connectionToken: getCookie("connectionToken")
    })

    socket.on("checkDiscordAuth", datas => {

        if(datas.state) {
            document.getElementById("pleaseconnect").hidden = true
        } else {
            if(datas.redirect) {
                setCookie("nextRedirectURI", \`\${window.location.href}\`)
                setTimeout(() => { window.location.href = datas.redirect }, 100)
            } else {
                document.getElementById("loading_page_text").textContent = \`Cannot load the page, please connect before throught the url \${window.location.origin}/discordAuth?discordredirect=true\`
            }
        }
    })*/



    Waterfall.createWaterfall(document.getElementById("mainbox"), pageInfos.waterfallSettings)
    very_default_settings = Waterfall.getSettings()
    
    default_settings = Waterfall.getSettings()
    
    let reset_from_opening_page_button = document.getElementById("contents_diverged")

    setInterval(() => {
        try {
            if(JSON.stringify(Waterfall.getSettings().mapped) != JSON.stringify(default_settings.mapped)) {
                confirm_button.className = confirm_button.className.split(" opened").join("")+" opened"
            } else {
                confirm_button.className = confirm_button.className.split(" opened").join("")
            }
            
            if(JSON.stringify(Waterfall.getSettings().mapped) != JSON.stringify(very_default_settings.mapped)) {
                reset_from_opening_page_button.className = reset_from_opening_page_button.className.split(" opened").join("")+" opened"
            } else {
                reset_from_opening_page_button.className = reset_from_opening_page_button.className.split(" opened").join("")
            }
        } catch(e) {
            
        }
    }, 200)

}


Cooldowns.add("discard_button",1000)
Cooldowns.add("send_datas",1000)

function _settings_reset_default() {
    if(!confirm("[EN] Are you sure? It will reset and save the data as you got it the first time you loaded this page.\\n\\n[FR] Êtes-vous sûr? Cela réinitialisera et enregistrera les données telles que vous les avez obtenues la première fois que vous avez chargé cette page.")) return;
    
    if(!Cooldowns.test("discard_button")) return;
    Waterfall.clearWaterfall(document.getElementById("mainbox"))
    Waterfall.createWaterfall(document.getElementById("mainbox"), pageInfos.waterfallSettings)
}

function _settings_send_datas() {
    
    if(pageInfos.oneUse) {
        if(!confirm("[EN] Warning ! This page is for single use, it means that if you save this page only once it will expire. DO NOT SAVE UNTIL YOU DONE.\\n\\n[FR] Avertissement ! Cette page est à usage unique, cela signifie que si vous enregistrez cette page une seule fois elle expirera. NE PAS ENREGISTRER AVANT D'AVOIR TERMINÉ.")) return;
    }

    if(!Cooldowns.test("send_datas")) return;
    if(!Waterfall.canSaveJSON()) {
        alert(\`Certains champs requis ne sont pas remplis !\`)
        return;
    }
    default_settings = Waterfall.getSettings()
    sendSettingsToAPI()
}


socket.on("sendSettings", () => {
    document.getElementById("saving").hidden = true
    if(pageInfos.oneUse) {
        console.log("ff")
        window.location.href = \`/expired?message=\${"The setting page you previously was on was a one-use page.".split(" ").join("%20")}\`
    }
})

function sendSettingsToAPI() {
    setTimeout(() => {
        socket.emit("sendSettings", {
            connectionToken: getCookie("connectionToken"),
            url: window.location.href,
            settings: Waterfall.getSettings(),
            backToEndpointUrl: pageInfos.backToEndpointUrl,
        })
    }, 500)
    document.getElementById("saving").hidden = false
}



</script>

</html>`

module.exports.getHTML = getHTML
function getHTML() { return html_page }