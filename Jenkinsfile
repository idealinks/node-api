pipeline
{
    options
    {
        buildDiscarder(logRotator(numToKeepStr: '3'))
    }
    agent any
    environment 
    {
        VERSION = '$TAG'
        PROJECT = 'communities-node-api'
        IMAGE = 'communities-node-api:$TAG'
        ECRURL = 'http://725320927509.dkr.ecr.us-east-1.amazonaws.com'
        ECRCRED = 'JenkinsBuildServer'
        Cluster = "${Cluster}"
        Region = "${Region}"
        ServiceName = "ReactApi"
    }
    stages
    {
        stage('Build preparations')
        {
            steps
            {
                script 
                {
                    // calculate GIT lastest commit short-hash
                    gitCommitHash = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                    shortCommitHash = gitCommitHash.take(7)
                    // calculate a sample version tag
                    VERSION = shortCommitHash
                    // set the build display name
                    currentBuild.displayName = "#${BUILD_ID}-${VERSION}"
                    IMAGE = "$PROJECT:$VERSION"
                }
            }
        }
        stage('Docker build')
        {
            steps
            {
                script
                {
                    // update AWS_ENV_PATH value                   
                    sh "sed -i 's|{{ParameterPath}}|${ParameterPath}|g' Dockerfile"

                    // Build the docker image using a Dockerfile
                    docker.build("$IMAGE",".")
                }
            }
        }
        stage('Test image') 
        {
            steps
            {
                script 
                {
                    /* Ideally, we would run a test framework against our image.*/
                    sh 'echo "Tests passed"'
		        }
            }
        }
        stage('Docker push') 
        {
            steps
            {
                script
                {
                    // cleanup current user docker credentials
                    sh 'rm  ~/.dockercfg || true'
                    sh 'rm ~/.docker/config.json || true'

                    // login to ECR - for now it seems that that the ECR Jenkins plugin is not performing the login as expected. I hope it will in the future.
                    sh("eval \$(aws ecr get-login --no-include-email | sed 's|https://||')")
                    // Push the Docker image to ECR
                    docker.withRegistry(ECRURL)
                    {
                        docker.image(IMAGE).push()
                        docker.image(IMAGE).push('$TAG')
                    }
                }
            }
        }
        stage('Deploy')
        {
            steps
            {
                script 
                {
                    
                    // get the service belonging to this cluster (presumes one exists and there is only one)
                    Service = sh(
                        script: "aws ecs list-services --cluster ${Cluster} | grep 'arn:aws:ecs' | grep ${ServiceName} | sed 's/.*\\///' | sed 's/\"//' | sed 's/,//'",
                        returnStdout: true
                    ).trim()
                    
                    // if we found a service, trigger deployment
                    if (Service) {
                        echo "Found service: ${Service}.  Starting deployment..."
                        sh("aws ecs update-service --cluster ${Cluster} --service ${Service} --force-new-deployment --region ${Region}")
                        
                    // otherwise, fail with error
                    } else {
                        error("Unable to find a service within cluster ${Cluster}.")
                    }

                }
            }
        }
    }

    
    post
    {
        always
        {
            // make sure that the Docker image is removed
            sh "docker rmi $IMAGE | true"
        }
    }
} 