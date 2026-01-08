/**
 * Shared library function to deploy backend microservices
 * Supports deployment of individual services or all services
 */
def call(Map config = [:]) {
    pipeline {
        agent any
        
        environment {
            NODE_VERSION = config.nodeVersion ?: '18'
            SERVICES = config.services ?: []
            REGISTRY = config.registry ?: 'docker.io'
            TAG = config.tag ?: "latest"
            ENVIRONMENT = config.environment ?: 'staging'
        }
        
        stages {
            stage('Checkout') {
                steps {
                    script {
                        checkout scm
                    }
                }
            }
            
            stage('Setup Node.js') {
                steps {
                    script {
                        sh "node --version"
                        sh "npm --version"
                    }
                }
            }
            
            stage('Install Backend Dependencies') {
                steps {
                    script {
                        sh "cd backend && npm ci"
                    }
                }
            }
            
            stage('Run Backend Tests') {
                steps {
                    script {
                        sh "cd backend && npm run test"
                    }
                }
            }
            
            stage('Build Services') {
                steps {
                    script {
                        if (SERVICES.size() > 0) {
                            SERVICES.each { service ->
                                echo "Building service: ${service}"
                                sh "cd backend && npx nest build ${service}"
                            }
                        } else {
                            echo "Building all services"
                            sh "cd backend && npm run build"
                        }
                    }
                }
            }
            
            stage('Docker Build Services') {
                steps {
                    script {
                        if (SERVICES.size() > 0) {
                            SERVICES.each { service ->
                                echo "Building Docker image for service: ${service}"
                                sh """
                                    cd backend
                                    docker build -t ${service}:${TAG} -f apps/${service}/Dockerfile .
                                """
                            }
                        } else {
                            echo "Building Docker images for all services"
                            sh """
                                cd backend
                                docker-compose build
                            """
                        }
                    }
                }
            }
            
            stage('Push Images') {
                steps {
                    script {
                        if (ENVIRONMENT == 'production') {
                            if (SERVICES.size() > 0) {
                                SERVICES.each { service ->
                                    echo "Pushing image for service: ${service}"
                                    sh """
                                        docker tag ${service}:${TAG} ${REGISTRY}/${service}:${TAG}
                                        docker push ${REGISTRY}/${service}:${TAG}
                                    """
                                }
                            } else {
                                echo "Pushing images for all services"
                                // In a real scenario, you would push each service image
                                echo "Skipping bulk push in this example"
                            }
                        } else {
                            echo "Skipping image push for non-production environment"
                        }
                    }
                }
            }
            
            stage('Deploy Services') {
                steps {
                    script {
                        if (ENVIRONMENT == 'production') {
                            if (SERVICES.size() > 0) {
                                SERVICES.each { service ->
                                    echo "Deploying service: ${service} to production"
                                    // Add your production deployment commands here
                                    // e.g., kubectl set image deployment/${service}-deployment ${service}=${REGISTRY}/${service}:${TAG}
                                }
                            } else {
                                echo "Deploying all services to production"
                                // Add your production deployment commands here
                                // e.g., kubectl apply -f backend/k8s/
                            }
                        } else {
                            echo "Deploying to staging environment"
                            if (SERVICES.size() > 0) {
                                SERVICES.each { service ->
                                    echo "Deploying service: ${service} to staging"
                                    // Add your staging deployment commands here
                                }
                            } else {
                                echo "Deploying all services to staging"
                                // For local development, we can just restart docker-compose
                                sh "cd backend && docker-compose down && docker-compose up -d"
                            }
                        }
                    }
                }
            }
        }
        
        post {
            success {
                script {
                    echo "Backend deployment successful!"
                }
            }
            failure {
                script {
                    echo "Backend deployment failed!"
                    // Add notifications here (email, Slack, etc.)
                }
            }
        }
    }
}