const timeout = require("connect-timeout")

module.exports = {
    /**
     * Register the request timeout
     * 
     * @param {Express.Application} app 
     * @param {Object} appConfig
     */
    registerToApp(app, appConfig) {
        app.use(timeout(appConfig.timeout, { 
            respond: false 
        }));
        app.use((req, res, next) => {
            if (!req.timedout) 
                next();
        });
    }
}