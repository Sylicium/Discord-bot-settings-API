
try {
    require("dotenv").config()
} catch(e) {}

module.exports = {
    server: {
        port: 80
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
                    redirectURI: "https://google.com"
                }
            },
            api_documentation: "localhost/docs"
        }
    }
}