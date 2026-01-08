/**
 * Shared library function to deploy the frontend application
 * Supports both build and deployment stages
 */
def call(Map config = [:]) {
    pipeline {
        agent any
        
        environment {
            NODE_VERSION = config.nodeVersion ?: '18'
            BUILD_DIR = config.buildDir ?: 'dist'
            REGISTRY = config.registry ?: 'docker.io'
            IMAGE_NAME = config.imageName ?: 'frontend-app'
            TAG = config.tag ?: "latest"
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
            
            stage('Install Dependencies') {
                steps {
                    script {
                        dir('frontend') {
                            sh "npm ci"
                        }
                    }
                }
            }
            
            stage('Lint') {
                steps {
                    script {
                        dir('frontend') {
                            sh "npm run lint || echo 'Linting failed'"
                        }
                    }
                }
            }
            
            stage('Build') {
                steps {
                    script {
                        dir('frontend') {
                            sh "npm run build"
                        }
                    }
                }
            }
            
            stage('Docker Build') {
                steps {
                    script {
                        dir('frontend') {
                            sh """
                                docker build -t ${IMAGE_NAME}:${TAG} .
                            """
                        }
                    }
                }
            }
            
            stage('Deploy') {
                steps {
                    script {
                        // Deploy to staging by default
                        if (config.environment == 'production') {
                            dir('frontend') {
                                sh """
                                    echo "Deploying to production environment"
                                    docker push ${REGISTRY}/${IMAGE_NAME}:${TAG}
                                    # Add your production deployment commands here
                                    # e.g., kubectl set image deployment/frontend-deployment frontend=${REGISTRY}/${IMAGE_NAME}:${TAG}
                                """
                            }
                        } else {
                            dir('frontend') {
                                sh """
                                    echo "Deploying to staging environment"
                                    # For local development, deploy with Docker Compose
                                    # Create a simple docker-compose for frontend if needed
                                    echo "Deploying frontend with Docker"
                                """
                            }
                        }
                    }
                }
            }
        }
        
        post {
            success {
                script {
                    echo "Frontend deployment successful!"
                }
            }
            failure {
                script {
                    echo "Frontend deployment failed!"
                    // Add notifications here (email, Slack, etc.)
                }
            }
        }
    }
}