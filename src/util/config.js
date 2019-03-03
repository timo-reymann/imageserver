const fs = require("fs")
const path = require("path")

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
            timeout: 10000,
            localImageFolder: 'localImages',
			maxDimension: 10000
        }
    },

    /**
     * Load configuration from file system
     */
    load() {
        let fileContent;
        try {
            fileContent = fs.readFileSync("config.json", "utf8")
        } catch (e) {
            console.info("Configuration file not found, falling back to default")
            return
        }

        try {
            this._config = JSON.parse(fileContent)
        } catch (e) {
            console.error("Error parsing configuration file")
            process.exit(1)
        }
    },

    /**
     * Load config file relative to source folder
     * 
     * @param {String} relativePath Path starting after src/config
     */
    loadConfigFile(relativePath) {
        return JSON.parse(fs.readFileSync(path.resolve("src", "config", relativePath), "utf8"))
    },

    /**
     * Load options for processing
     */
    loadProcessOptions() {
        return this.loadConfigFile("options/processing.json");
    },

    /**
     *
     * Load placeholder options
     */
    loadPlaceholderOptions() {
        return this.loadConfigFile("options/placeholder.json")
    },

    /**
     * Get configuration
     */
    get config() {
        return this._config === null ? this._default : this._config
    }
}