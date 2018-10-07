// Express, App creation
const express = require("express")
const app = express();

// Utility
const requestUtil = require("./util/request")
const { ImageProcessor } = require("./processing/imageProcessor")
const appConfig = require("./util/config")
const path = require("path")

// Middleware
const requestTimeoutMiddleware = require("./middleware/requestTimeout")
const requestLogMiddleware = require("./middleware/requestLog")
const errorHandlingMiddleware = require("./middleware/errorHandler")

requestTimeoutMiddleware.registerToApp(app)
requestLogMiddleware.registerToApp(app)
errorHandlingMiddleware.registerToApp(app)

// Initialize configuration
appConfig.load();
const options = appConfig.loadOptions()

app.get("/", async (request,response) => {
    const tmpFile = path.resolve("./tmp.jpeg")
    const sourceFile = path.resolve("./example")
    const query = requestUtil.parseQuery(request)

    let config = {};

    // Read all options from url
    options.forEach(o => {
        config[o.key] = requestUtil.getQueryParameter(query, o.parameter, o.default)
    })

    const imageProcessor = new ImageProcessor(config, tmpFile, sourceFile)

    try {
        imageProcessor.process()
    } catch (e) {
        console.error("Error while processing image, returning raw image", e)
    }
    
    imageProcessor.stream(response)
})

app.listen(appConfig.config.port,() => {
    console.log(`Listening on port ${appConfig.config.port}`)
})