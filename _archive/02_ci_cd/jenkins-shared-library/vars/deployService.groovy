/**
 * Shared library function to deploy a specific service
 * This demonstrates how to use the DeploymentHelper class
 */
def call(Map config = [:]) {
    def serviceName = config.service ?: ''
    
    if (!serviceName) {
        error "Service name is required"
    }
    
    // Import and use the helper class
    def helper = new org.example.deployment.DeploymentHelper(this)
    
    // Validate service
    if (!helper.isValidService(serviceName)) {
        error "Invalid service: ${serviceName}"
    }
    
    pipeline {
        agent any
        
        stages {
            stage('Checkout') {
                steps {
                    script {
                        checkout scm
                    }
                }
            }
            
            stage('Deploy Service') {
                steps {
                    script {
                        echo "Deploying service: ${serviceName}"
                        
                        // Build the service
                        sh "cd backend && npx nest build ${serviceName}"
                        
                        // Build Docker image
                        sh """
                            cd backend
                            docker build -t ${serviceName}:${config.tag ?: 'latest'} -f apps/${serviceName}/Dockerfile .
                        """
                        
                        // Deploy based on environment
                        if (config.environment == 'production') {
                            def registry = config.registry ?: 'docker.io'
                            def tag = config.tag ?: 'latest'
                            
                            // Push to registry
                            sh """
                                docker tag ${serviceName}:${tag} ${registry}/${serviceName}:${tag}
                                docker push ${registry}/${serviceName}:${tag}
                            """
                            
                            // Deploy to production (example with Kubernetes)
                            sh """
                                kubectl set image deployment/${serviceName}-deployment ${serviceName}=${registry}/${serviceName}:${tag}
                            """
                        } else {
                            // Deploy to staging with Docker Compose
                            helper.deployWithDockerCompose(serviceName)
                        }
                    }
                }
            }
        }
        
        post {
            success {
                script {
                    echo "Service ${serviceName} deployed successfully!"
                }
            }
            failure {
                script {
                    echo "Service ${serviceName} deployment failed!"
                }
            }
        }
    }
}