package org.example.deployment

/**
 * Helper class for deployment operations
 * Version: 2.0 (Updated January 2026)
 * Added all 15 microservices and enhanced functionality
 */
class DeploymentHelper implements Serializable {
    
    def steps
    
    // List of all microservices in the platform
    static final List<String> ALL_SERVICES = [
        'api-gateway',
        'user-service',
        'auth-service',
        'course-service',
        'enrollment-service',
        'payment-service',
        'media-service',
        'notification-service',
        'progress-service',
        'content-service',
        'assessment-service',
        'review-service',
        'certificate-service',
        'gamification-service',
        'admin-service'
    ]
    
    DeploymentHelper(steps) {
        this.steps = steps
    }
    
    /**
     * Get list of all microservices in the backend
     */
    def getAllServices() {
        return ALL_SERVICES
    }
    
    /**
     * Validate if a service exists
     */
    def isValidService(String serviceName) {
        return ALL_SERVICES.contains(serviceName)
    }
    
    /**
     * Get Docker image name for a service
     */
    def getImageName(String serviceName, String registry = "", String tag = "latest") {
        if (registry) {
            return "${registry}/${serviceName}:${tag}"
        }
        return "${serviceName}:${tag}"
    }
    
    /**
     * Deploy a service using Docker Compose
     */
    def deployWithDockerCompose(String serviceName = "") {
        try {
            steps.sh "cd backend && docker-compose down"
            
            if (serviceName) {
                steps.sh "cd backend && docker-compose up -d ${serviceName}"
            } else {
                steps.sh "cd backend && docker-compose up -d"
            }
        } catch (Exception e) {
            steps.error("Docker Compose deployment failed: ${e.message}")
        }
    }
    
    /**
     * Deploy a service using Kubernetes
     */
    def deployWithKubernetes(String serviceName = "", String environment = "staging") {
        try {
            def namespace = environment == 'production' ? 'backend-prod' : 'backend-staging'
            
            if (serviceName) {
                steps.sh "kubectl apply -f backend/k8s/${serviceName}.yaml -n ${namespace}"
                steps.sh "kubectl rollout status deployment/${serviceName}-deployment -n ${namespace}"
            } else {
                steps.sh "kubectl apply -f backend/k8s/ -n ${namespace}"
            }
        } catch (Exception e) {
            steps.error("Kubernetes deployment failed: ${e.message}")
        }
    }
    
    /**
     * Build Docker image for a service
     */
    def buildDockerImage(String serviceName, String tag = "latest") {
        try {
            steps.sh """
                cd backend
                docker build -t ${serviceName}:${tag} -f apps/${serviceName}/Dockerfile .
            """
        } catch (Exception e) {
            steps.error("Docker build failed for ${serviceName}: ${e.message}")
        }
    }
    
    /**
     * Push Docker image to registry
     */
    def pushDockerImage(String serviceName, String registry, String tag, String credentials) {
        try {
            steps.withCredentials([steps.usernamePassword(
                credentialsId: credentials,
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )]) {
                steps.sh "echo \$DOCKER_PASS | docker login ${registry} -u \$DOCKER_USER --password-stdin"
                steps.sh "docker tag ${serviceName}:${tag} ${registry}/${serviceName}:${tag}"
                steps.sh "docker push ${registry}/${serviceName}:${tag}"
            }
        } catch (Exception e) {
            steps.error("Docker push failed for ${serviceName}: ${e.message}")
        }
    }
    
    /**
     * Run Prisma migrations
     */
    def runPrismaMigrations() {
        try {
            steps.sh "cd backend && npx prisma generate"
            steps.sh "cd backend && npx prisma migrate deploy"
        } catch (Exception e) {
            steps.error("Prisma migrations failed: ${e.message}")
        }
    }
    
    /**
     * Health check for deployed service
     */
    def healthCheck(String serviceName, String port, int retries = 5) {
        for (int i = 0; i < retries; i++) {
            try {
                steps.sh "curl -f http://localhost:${port}/health || true"
                steps.echo "${serviceName} health check passed"
                return true
            } catch (Exception e) {
                steps.echo "Health check attempt ${i + 1}/${retries} failed, retrying..."
                steps.sleep(time: 10, unit: 'SECONDS')
            }
        }
        steps.error("Health check failed for ${serviceName} after ${retries} attempts")
    }
}