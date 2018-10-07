const os = require("os")
const path = require("path")
const {uuid} = require("./uid")

module.exports = {
    /**
     * Join path to tmp directory
     * @param {String} path Path to join to tmp directory
     */
    tmpPath(path) {
        return path.join(os.tmpdir(), path)
    },

    /**
     * Create tmp file with unique name
     * 
     * @param {String} prefix Prefix for the file
     */
    uniqueTmpFile(prefix) {
        return path.join(os.tmpdir(), prefix + uuid())
    }
}