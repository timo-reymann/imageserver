const uuid = require("uuid")

module.exports = {
    /**
     * Create a unique identifier
     */
    uuid() {
        return uuid.v4();
    }
}