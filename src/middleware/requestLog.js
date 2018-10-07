module.exports = {
    /**
     * Register request logging middleware
     * 
     * @param {Express.Application} app 
     */
    registerToApp(app) {
        app.use((request, response, next) => {
            console.info(`${request.method} ${request.originalUrl}`)
            next()
        })
    }
}