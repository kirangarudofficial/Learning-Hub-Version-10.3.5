# Jenkins Shared Library Setup Guide

This document explains how to set up and use the Jenkins shared library for deploying the Learning Hub platform.

## Prerequisites

1. Jenkins server (version 2.200 or higher)
2. Docker and Docker Compose installed on Jenkins agents
3. Node.js and npm installed on Jenkins agents
4. Git installed on Jenkins agents
5. Kubernetes CLI (kubectl) installed on Jenkins agents (if using Kubernetes)

## Setting up the Shared Library in Jenkins

1. In Jenkins, go to **Manage Jenkins** → **System**
2. Scroll down to **Global Pipeline Libraries**
3. Click **Add**
4. Configure the library:
   - **Name**: `microservices-deployment`
   - **Default version**: `main` (or your preferred branch)
   - **Retrieval method**: Modern SCM
   - **Source Code Management**: Git
   - **Project Repository**: URL to this repository
   - **Credentials**: Select appropriate credentials if repository is private

## Using the Shared Library

### 1. Frontend Deployment

Create a `Jenkinsfile` in your frontend repository or directory:

```groovy
@Library('microservices-deployment') _

deployFrontend(
    nodeVersion: '18',
    buildDir: 'dist',
    registry: 'your-registry.com',
    imageName: 'learning-hub-frontend',
    tag: "v1.0.${BUILD_NUMBER}",
    environment: 'staging'  // or 'production'
)
```

### 2. Backend Services Deployment

Create a `Jenkinsfile` in your backend repository or directory:

```groovy
@Library('microservices-deployment') _

// Deploy specific services
deployBackend(
    nodeVersion: '18',
    services: ['user-service', 'auth-service', 'course-service'],
    registry: 'your-registry.com',
    tag: "v1.0.${BUILD_NUMBER}",
    environment: 'staging'  // or 'production'
)
```

Or deploy all services:

```groovy
@Library('microservices-deployment') _

// Deploy all services
deployBackend(
    nodeVersion: '18',
    registry: 'your-registry.com',
    tag: "v1.0.${BUILD_NUMBER}",
    environment: 'staging'  // or 'production'
)
```

### 3. Full Platform Deployment

Deploy both frontend and backend services together:

```groovy
@Library('microservices-deployment') _

deployMicroservices(
    nodeVersion: '18',
    frontendBuildDir: 'dist',
    backendServices: [], // Empty means deploy all services
    registry: 'your-registry.com',
    tag: "v1.0.${BUILD_NUMBER}",
    environment: 'staging'  // or 'production'
)
```

## Configuration Options

### Frontend Deployment Options:
- `nodeVersion`: Node.js version to use (default: '18')
- `buildDir`: Build output directory (default: 'dist')
- `registry`: Docker registry (default: 'docker.io')
- `imageName`: Docker image name (default: 'frontend-app')
- `tag`: Docker image tag (default: 'latest')
- `environment`: Deployment environment ('staging' or 'production')

### Backend Deployment Options:
- `nodeVersion`: Node.js version to use (default: '18')
- `services`: List of specific services to deploy (default: all services)
- `registry`: Docker registry (default: 'docker.io')
- `tag`: Docker image tag (default: 'latest')
- `environment`: Deployment environment ('staging' or 'production')

## Environment-specific Configuration

### For Production Deployment:
1. Ensure Docker registry credentials are configured in Jenkins
2. Update the registry parameter to point to your production registry
3. Set environment to 'production'
4. The pipeline will automatically push images to the registry

### For Staging Deployment:
1. Set environment to 'staging'
2. Images will be built but not pushed to registry
3. Services will be deployed locally using Docker Compose

## Customizing Deployments

You can customize the deployment behavior by modifying the Groovy files in the `vars/` directory:

- `deployFrontend.groovy`: Frontend deployment pipeline
- `deployBackend.groovy`: Backend services deployment pipeline
- `deployMicroservices.groovy`: Combined deployment pipeline

## Troubleshooting

### Common Issues:

1. **Docker permission denied**: Ensure Jenkins user has permissions to run Docker commands
2. **Node.js not found**: Verify Node.js is installed on Jenkins agents
3. **Git checkout fails**: Check repository credentials in Jenkins
4. **Docker build fails**: Ensure Docker daemon is running on Jenkins agents

### Logs and Debugging:

- Check Jenkins console output for detailed error messages
- Enable verbose logging by adding `sh "set -x"` in pipeline stages for debugging
- Use `docker logs <container>` to inspect container logs

## Security Considerations

1. Store sensitive information (passwords, API keys) in Jenkins Credentials
2. Use Jenkins Credentials Binding plugin to inject secrets into pipelines
3. Regularly update base Docker images
4. Scan Docker images for vulnerabilities
5. Limit Jenkins agent permissions to only what is necessary

## Monitoring and Notifications

The pipelines include basic success/failure notifications. You can enhance this by:

1. Adding email notifications using the Email Extension plugin
2. Integrating with Slack or other messaging platforms
3. Adding deployment status updates to your monitoring system