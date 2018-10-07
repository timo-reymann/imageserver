module.exports = {

    /**
     * Register error handling middleware
     * 
     * @param {Express.Application} app 
     */
    registerToApp(app) {
        app.use((err, req, res, next) => {
            console.error("An server error occured",err.stack);
            res.status(500).send('Oh snap! Something went horribly wrong');
        });

        process.on("uncaughtException",(e) => {
            console.error("RuntimeError",e)
        })
    }
} 