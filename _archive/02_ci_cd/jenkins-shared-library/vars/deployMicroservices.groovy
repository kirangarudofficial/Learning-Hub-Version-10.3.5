/**
 * Shared library function to deploy both frontend and backend microservices
 * This is a comprehensive deployment function that handles the entire platform
 */
def call(Map config = [:]) {
    pipeline {
        agent any
        
        environment {
            NODE_VERSION = config.nodeVersion ?: '18'
            FRONTEND_BUILD_DIR = config.frontendBuildDir ?: 'dist'
            BACKEND_SERVICES = config.backendServices ?: []
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
            
            stage('Setup Environment') {
                steps {
                    script {
                        sh "node --version"
                        sh "npm --version"
                        sh "docker --version"
                    }
                }
            }
            
            stage('Deploy Frontend') {
                steps {
                    script {
                        // Deploy frontend application
                        dir('frontend') {
                            sh "npm ci"
                            sh "npm run build"
                            
                            // Build Docker image
                            sh """
                                docker build -t frontend:${TAG} .
                            """
                            
                            // Push to registry if production
                            if (ENVIRONMENT == 'production') {
                                sh """
                                    docker tag frontend:${TAG} ${REGISTRY}/frontend:${TAG}
                                    docker push ${REGISTRY}/frontend:${TAG}
                                """
                            }
                        }
                    }
                }
            }
            
            stage('Deploy Backend Services') {
                steps {
                    script {
                        dir('backend') {
                            // Install dependencies
                            sh "npm ci"
                            
                            // Run tests
                            sh "npm run test"
                            
                            // Build services
                            if (BACKEND_SERVICES.size() > 0) {
                                BACKEND_SERVICES.each { service ->
                                    echo "Building service: ${service}"
                                    sh "npx nest build ${service}"
                                }
                            } else {
                                echo "Building all services"
                                sh "npm run build"
                            }
                            
                            // Build Docker images
                            if (BACKEND_SERVICES.size() > 0) {
                                BACKEND_SERVICES.each { service ->
                                    echo "Building Docker image for service: ${service}"
                                    sh """
                                        docker build -t ${service}:${TAG} -f apps/${service}/Dockerfile .
                                    """
                                    
                                    // Push to registry if production
                                    if (ENVIRONMENT == 'production') {
                                        sh """
                                            docker tag ${service}:${TAG} ${REGISTRY}/${service}:${TAG}
                                            docker push ${REGISTRY}/${service}:${TAG}
                                        """
                                    }
                                }
                            } else {
                                echo "Building Docker images for all services"
                                sh "docker-compose build"
                                
                                // Push to registry if production
                                if (ENVIRONMENT == 'production') {
                                    echo "Pushing images for all services"
                                    // In a real scenario, you would push each service image
                                }
                            }
                        }
                    }
                }
            }
            
            stage('Deploy to Environment') {
                steps {
                    script {
                        if (ENVIRONMENT == 'production') {
                            echo "Deploying to production environment"
                            // Add your production deployment commands here
                            // This could be Kubernetes deployments, ECS, etc.
                            sh "cd backend && docker-compose down && docker-compose up -d"
                        } else {
                            echo "Deploying to staging environment"
                            // For local development, we can just restart docker-compose
                            sh "cd backend && docker-compose down && docker-compose up -d"
                        }
                    }
                }
            }
        }
        
        post {
            success {
                script {
                    echo "Full platform deployment successful!"
                    // Send success notifications
                }
            }
            failure {
                script {
                    echo "Platform deployment failed!"
                    // Send failure notifications
                }
            }
        }
    }
}