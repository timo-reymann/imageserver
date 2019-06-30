#!groovy

node {
    def imageName = "timoreymann/imageserver"
    def credentials = 'timoreymann-docker'
    def registry = 'https://registry.hub.docker.com'
    def app
    def tag = increaseMinorVersion(getLastTag())

    currentBuild.description = tag

    stage('Checkout') {
        checkout scm
        checkoutBranch env.BRANCH_NAME
        configureGitCommiter()
        configureGitPushUrl("github-timo-reymann")
    }

    stage('Build') {
        app = docker.build(imageName, "--pull .")
    }

    stage("Publish") {
       gitTag(tag)
       gitPushAll()

       docker.withRegistry(registry, credentials) {
         dockerRelease(app, tag)
       }
    }
}
