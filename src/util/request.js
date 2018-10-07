const url = require("url")
const fs = require("fs")
const os = require("os")
const path = require("path")

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
        return new Promise(resolve => {
            let fullPath = path.join(os.tmpdir(),destination);
            const file = fs.createWriteStream(fullPath);
            http.get(url, (response) => {
              response.pipe(file);
              resolve(fullPath)
            });
        })
    }
}