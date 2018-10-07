const {execFileSync} = require("child_process")
const path = require("path")

module.exports = {
    /**
     * Execute a script from the native folder
     * 
     * @param {String} fileName 
     * @param {String} args 
     */
    execScript(fileName, args) {
        return execFileSync(path.join("src","native",fileName),args)
    }
}