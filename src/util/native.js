const {execFileSync} = require("child_process")
const path = require("path")
const mmm = require('mmmagic')
const magic = new mmm.Magic(mmm.MAGIC_MIME);

module.exports = {
    /**
     * Execute a script from the native folder
     * 
     * @param {String} fileName 
     * @param {String} args 
     */
    execScript(fileName, args) {
        return execFileSync(path.join("src","native",fileName),args)
    },
    async detectMimeType(sourceFile) {
        return new Promise((resolve, reject) => {
            magic.detectFile(sourceFile, function(err, result) {
                if(err !== null)
                    reject(err)
                
                resolve(result);
            });
        })
    }
}