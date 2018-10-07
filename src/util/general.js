const os = require("os")
const path = require("path")
const {uuid} = require("./uid")
module.exports = {
    tmpPath(path) {
        return path.join(os.tmpdir(), path)
    },

    uniqueTmpFile(prefix) {
        return path.join(os.tmpdir(), prefix + uuid())
    }
}