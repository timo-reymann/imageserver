const url = require("url")
const fs = require("fs")
const os = require("os")
const path = require("path")
const { uniqueTmpFile }  = require("./general")
const request = require("request")

module.exports = {
    /**
     * Get query parameter from url
     * @param {URL} url Raw request url 
     * @param {String} parameter Name of GET-Parameter
     * @param {any} defaultValue Default value if no value is found, if nothing is set this is null
     */
    getQueryParameter(url, parameter, defaultValue) {
        const params = url.query

        if(typeof defaultValue === "undefined") {
            defaultValue = null
        }

        return params[parameter] ? params[parameter] : defaultValue;
    },

    /**
     * Parse query from url
     * @param {Express.Request} request 
     */
    parseQuery(request) {
        return url.parse(request.url, true)
    },

    /**
     * Download file from url to tmp dir and return file name saved as
     * @param {String} url 
     */
    async download(url) {
        // TODO: Test
        return new Promise((resolve, reject) => {
            let fullPath =  uniqueTmpFile("dl_");
            const file = fs.createWriteStream(fullPath);
            const req = request(url);
            req.on("error",(e) => {
                console.error("Error loading image", e);
                reject(e);
            }).on("response",r => {
                if(r.statusCode < 200 || r.statusCode >= 400) {
                    console.error("Invalid status code", r.statusCode)
                    reject("Invalid status code")
                }
            })
            req.pipe(file)
            req.on("end",() => resolve(fullPath))
        })
    }
}