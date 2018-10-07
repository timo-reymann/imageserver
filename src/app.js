// Express, App creation
const express = require("express")
const app = express();

// Utility
const requestUtil = require("./util/request")
const { ImageProcessor } = require("./processing/imageProcessor")
const appConfig = require("./util/config")
const path = require("path")
const { uuid } = require("./util/uid")
const { uniqueTmpFile } = require("./util/general")

// Middleware
const requestTimeoutMiddleware = require("./middleware/requestTimeout")
const requestLogMiddleware = require("./middleware/requestLog")
const errorHandlingMiddleware = require("./middleware/errorHandler")

// Initialize configuration
appConfig.load();
const options = appConfig.loadOptions()

// Register middleware
requestTimeoutMiddleware.registerToApp(app, appConfig.config)
requestLogMiddleware.registerToApp(app)
errorHandlingMiddleware.registerToApp(app)

app.get("/",(request, response) => {
    response.send({
        "Image-Processing": "/process",
        "Options": "/options"
    })
})

app.get("/process", async (request,response) => {
    const tmpFile = uniqueTmpFile("proc_")
    const query = requestUtil.parseQuery(request)

    let sourceFile;
    try {
        sourceFile = await requestUtil.download(requestUtil.getQueryParameter(query,"source"))
    } catch(e) {
        response.send("Invalid url")
        response.status = 400;
        return;
    }

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

app.get("/options",(request, response) => {
    response.setHeader("Content-Type", "application/json")
    response.send(options);
})

app.listen(appConfig.config.port,() => {
    console.log(`Listening on port ${appConfig.config.port}`)
})