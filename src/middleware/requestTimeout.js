const timeout = require("connect-timeout")

module.exports = {
    /**
     * Register the request timeout
     * 
     * @param {Express.Application} app 
     */
    registerToApp(app) {
        app.use(timeout(10000, { 
            respond: false 
        }));
        app.use((req, res, next) => {
            if (!req.timedout) 
                next();
        });
    }
}