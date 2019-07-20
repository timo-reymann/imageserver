#!groovy

node {
    properties([
        parameters([
            gitTagVersionInput()
        ])
    ])

    runDefaultDockerPipeline currentBuild: currentBuild, imageName: "timoreymann/imageserver", tag: params.Version
}
