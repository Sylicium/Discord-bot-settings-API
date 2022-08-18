# Discord-bot-settings-API
 The API that allows small independant discord bot developers to have a little website for their bots.

# Use

Go to https://dbs-api.captaincommand.repl.co/docs to see documentation

! First version of the API, only usable with the token defined by the variable API_TOKEN in the .env file. Change it in the server.js file.


# Replit

Lorsqu'un pull est effectué sur replit:
- dans index.js dans les premières ligne passer `inDev` à `false`
- dans localModules/logger.js dans les premières lignes passer `configuration.replitMode` à `true` et compléter la configuration si besoin