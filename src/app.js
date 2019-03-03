// Express, App creation
const express = require("express")
const app = express();

// Utility|App stuff
const requestUtil = require("./util/request")
const {ImageProcessor} = require("./processing/imageProcessor")
const appConfig = require("./util/config")
const {validateDimension} = require('./util/validation')
const path = require("path")
const {uuid} = require("./util/uid")
const {uniqueTmpFile} = require("./util/general")
const native = require("./util/native")
const {PlaceholderGenerator} = require("./processing/placeholderGenerator")

// Middleware
const requestTimeoutMiddleware = require("./middleware/requestTimeout")
const requestLogMiddleware = require("./middleware/requestLog")
const errorHandlingMiddleware = require("./middleware/errorHandler")

// Initialize configuration
appConfig.load();
const processOptions = appConfig.loadProcessOptions()
const placeholderOptions = appConfig.loadPlaceholderOptions()

// Register middleware
requestTimeoutMiddleware.registerToApp(app, appConfig.config)
requestLogMiddleware.registerToApp(app)
errorHandlingMiddleware.registerToApp(app)

app.get("/", (request, response) => {
    response.send({
        "Image-Processing": "/process",
        "Options for Image Processing": "/process/options",
        "Placeholder": "/placeholder/:width/:height",
        "Options for Placeholder": "/placeholder/options"
    })
})

app.get("/placeholder/:width/:height", async (request, response) => {
    const {width, height} = request.params
    const query = requestUtil.parseQuery(request)

    let config = {};
    placeholderOptions.forEach(o => {
        config[o.key] = requestUtil.getQueryParameter(query, o.parameter, o.default)
    })

    if (!validateDimension(appConfig, width) || !validateDimension(appConfig, height)) {
        response.send("Invalid dimensions")
        response.status = 400
    }

    const generator = new PlaceholderGenerator(width, height, config)
    await generator.render(response)
})

app.get("/process", async (request, response) => {
    const tmpFile = uniqueTmpFile("proc_")
    const query = requestUtil.parseQuery(request)

    let sourceFile;
    try {
        const localSource = requestUtil.getQueryParameter(query, "localSource")
        if (localSource === null) {
            sourceFile = await requestUtil.download(requestUtil.getQueryParameter(query, "source"))
        } else {
            sourceFile = path.join(appConfig.config.localImageFolder, localSource)
        }
        let contentType = (await native.detectMimeType(sourceFile));
        response.setHeader("Content-Type", contentType)
    } catch (e) {
        console.error(e);
        response.send("Invalid source")
        response.status = 400
        return;
    }

    let config = {};

    // Read all options for processing from url
    processOptions.forEach(o => {
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

app.get("/process/options", (request, response) => {
    response.setHeader("Content-Type", "application/json")
    response.send(processOptions);
})

app.get("/placeholder/options", (request, response) => {
    response.setHeader("Content-Type", "application/json")
    response.send(placeholderOptions)
})

app.listen(appConfig.config.port, () => {
    console.log(`Listening on port ${appConfig.config.port}`)
})