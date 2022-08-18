try {
    require("dotenv").config()
} catch(e) {}

module.exports = {
    server: {
        port: 80,
    },
    api: {
        tokens: JSON.parse(process.env.API_TOKENS),
        url: "https://dbs-api.captaincommand.repl.co/api"
    },
    application: {
        clientId: "1005628956965343253",
        clientSecret: process.env["CLIENT_SECRET"]
    },
    database: {
        url: process.env["MONGODB_URL"]
    },
    website: {
        title: "Discord Bot Settings API",
        favicon: "/assets/img/favicon.ico",
        uri: {
            discordAuth: {
                auth: {
                    //redirectURI: "https://google.com",
                    //oauth2: "https://discord.com/oauth2/authorize?client_id=1005628956965343253&redirect_uri=https%3A%2F%2Fgoogle.com&response_type=code&scope=identify"
                    redirectURI: "https://dbs-api.captaincommand.repl.co/discordAuth",
                    oauth2: "https://discord.com/api/oauth2/authorize?client_id=1005628956965343253&redirect_uri=https%3A%2F%2Fdbs-api.captaincommand.repl.co%2FdiscordAuth&response_type=code&scope=identify"
                }
            },
            api_documentation: "localhost/docs"
        }
    }
}