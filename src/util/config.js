const fs = require("fs")

module.exports = {
    /**
     * Active configuration
     */
    _config: null,

    /**
     * Default configuration
     */
    get _default() {
        return {
            port: 3000,
            timeout: 10000
        }
    },

    /**
     * Load configuration from file system
     */
     load() {
        let fileContent;
        try {
            fileContent = fs.readFileSync("config.json","utf8") 
        } catch(e) {
            console.info("Configuration file not found, falling back to default")
            return
        }

        try {
            this._config = JSON.parse(fileContent)
        } catch(e) {
            console.error("Error parsing configuration file")
            process.exit(1)
        }
    },

    /**
     * Load options for processing
     */
    loadOptions() {
        return JSON.parse(fs.readFileSync("src/processing/options.json","utf8"))
    },

    /**
     * Get configuration
     */
    get config() {
        return this._config === null ? this._default : this._config
    }
}