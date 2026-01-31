# AWS DevOps Engineer - Architecture Diagram

## Enterprise LMS Platform Architecture

```mermaid
graph TB
    subgraph "Developer Workflow"
        DEV[Developer] --> GIT[GitHub Repository]
    end
    
    subgraph "CI/CD Pipeline"
        GIT --> JENKINS[Jenkins Pipeline]
        JENKINS --> UNITTEST[Unit Tests]
        JENKINS --> INTTEST[Integration Tests]
        JENKINS --> SECSCAN[Security Scan<br/>Trivy/Snyk]
        UNITTEST --> BUILD[Docker Build]
        INTTEST --> BUILD
        SECSCAN --> BUILD
        BUILD --> ECR[Amazon ECR]
        ECR --> ARGOCD[ArgoCD<br/>GitOps]
    end
    
    subgraph "AWS Cloud - Region: US-EAST-1"
        subgraph "Edge & DNS"
            R53[Route 53<br/>DNS]
            CF[CloudFront<br/>CDN]
        end
        
        subgraph "VPC 10.0.0.0/16"
            subgraph "Public Subnets - 3 AZs"
                ALB[Application<br/>Load Balancer]
                NAT1[NAT Gateway AZ-A]
                NAT2[NAT Gateway AZ-B]
                NAT3[NAT Gateway AZ-C]
                WAF[AWS WAF]
            end
            
            subgraph "Private Subnets - Application Tier"
                subgraph "AZ-A"
                    EKS1A[EKS Node 1]
                    EKS2A[EKS Node 2]
                end
                subgraph "AZ-B"
                    EKS1B[EKS Node 3]
                    EKS2B[EKS Node 4]
                end
                subgraph "AZ-C"
                    EKS1C[EKS Node 5]
                    EKS2C[EKS Node 6]
                end
            end
            
            subgraph "Private Subnets - Data Tier"
                RDS[(RDS Aurora<br/>Multi-AZ)]
                REDIS[(ElastiCache<br/>Redis Cluster)]
            end
        end
        
        subgraph "Storage & Content Delivery"
            S3[S3 Buckets<br/>Static Assets<br/>Media Storage<br/>Backups]
        end
        
        subgraph "Serverless Processing"
            LAMBDA[Lambda Functions<br/>Video Processing]
            EB[EventBridge<br/>Scheduler]
        end
        
        subgraph "Monitoring & Security"
            CW[CloudWatch<br/>Metrics & Logs]
            XRAY[X-Ray<br/>Distributed Tracing]
            SM[Secrets Manager]
            KMS[KMS<br/>Encryption]
        end
    end
    
    subgraph "Deployment Target"
        ARGOCD --> ALB
        WAF --> ALB
        R53 --> CF
        CF --> ALB
        CF --> S3
        ALB --> EKS1A
        ALB --> EKS1B
        ALB --> EKS1C
        EKS1A --> RDS
        EKS1A --> REDIS
        EKS2A --> RDS
        EKS2B --> REDIS
        S3 --> LAMBDA
        EB --> LAMBDA
        EKS1A -.logs.-> CW
        EKS1B -.logs.-> CW
        EKS1C -.logs.-> CW
        EKS1A -.traces.-> XRAY
        SM -.secrets.-> EKS1A
        KMS -.encryption.-> S3
        KMS -.encryption.-> RDS
    end
    
    style JENKINS fill:#D24939
    style ECR fill:#FF9900
    style ALB fill:#FF9900
    style EKS1A fill:#FF9900
    style EKS1B fill:#FF9900
    style EKS1C fill:#FF9900
    style RDS fill:#3B48CC
    style REDIS fill:#DC382D
    style S3 fill:#569A31
    style LAMBDA fill:#FF9900
    style CW fill:#FF4F8B
    style WAF fill:#DD344C
```

## CI/CD Pipeline Details

```mermaid
graph LR
    subgraph "Source Control"
        A[Git Commit] --> B[GitHub Webhook]
    end
    
    subgraph "Build Stage"
        B --> C[Jenkins Triggered]
        C --> D[Checkout Code]
        D --> E[Install Dependencies]
        E --> F[Run Unit Tests]
        F --> G[Run Linting]
        G --> H[Security Scan]
    end
    
    subgraph "Container Stage"
        H --> I[Build Docker Image]
        I --> J[Scan Image - Trivy]
        J --> K[Tag Image]
        K --> L[Push to ECR]
    end
    
    subgraph "Deploy Stage"
        L --> M[Update Helm Values]
        M --> N[ArgoCD Sync]
        N --> O[Deploy to EKS]
        O --> P[Health Check]
        P --> Q[Smoke Tests]
    end
    
    subgraph "Notification"
        Q --> R{Success?}
        R -->|Yes| S[Slack Success]
        R -->|No| T[Slack Alert + Rollback]
    end
    
    style F fill:#90EE90
    style G fill:#90EE90
    style H fill:#FFA500
    style J fill:#FFA500
    style P fill:#87CEEB
    style S fill:#90EE90
    style T fill:#FF6B6B
```

## Infrastructure as Code Structure

```mermaid
graph TD
    subgraph "Terraform Modules"
        ROOT[Root Module] --> VPC[VPC Module]
        ROOT --> EKS[EKS Module]
        ROOT --> RDS[RDS Module]
        ROOT --> S3CF[S3-CloudFront Module]
        ROOT --> IAM[IAM Module]
        ROOT --> MON[Monitoring Module]
        
        VPC --> VPCOUT[VPC ID<br/>Subnet IDs<br/>Security Groups]
        EKS --> EKSOUT[Cluster Endpoint<br/>Node Groups<br/>OIDC Provider]
        RDS --> RDSOUT[DB Endpoint<br/>Connection String]
        S3CF --> S3OUT[Bucket Names<br/>CloudFront URL]
        IAM --> IAMOUT[Role ARNs<br/>Policies]
        MON --> MONOUT[Dashboard URLs<br/>SNS Topics]
    end
    
    subgraph "Environments"
        VPCOUT --> DEV[Development]
        VPCOUT --> STAGE[Staging]
        VPCOUT --> PROD[Production]
    end
    
    style ROOT fill:#5C4EE5
    style VPC fill:#FF9900
    style EKS fill:#FF9900
    style RDS fill:#3B48CC
    style S3CF fill:#569A31
    style PROD fill:#DC382D
```

## Kubernetes Cluster Architecture

```mermaid
graph TB
    subgraph "EKS Control Plane - Managed by AWS"
        API[API Server]
        SCHED[Scheduler]
        CM[Controller Manager]
        ETCD[(etcd)]
    end
    
    subgraph "Worker Nodes - Node Group: General"
        NODE1[t3.large - 1<br/>General Workloads]
        NODE2[t3.large - 2<br/>General Workloads]
        NODE3[t3.large - 3<br/>General Workloads]
    end
    
    subgraph "Worker Nodes - Node Group: Compute"
        NODE4[c6i.2xlarge - 1<br/>Video Processing]
        NODE5[c6i.2xlarge - 2<br/>AI/ML Tasks]
    end
    
    subgraph "Worker Nodes - Node Group: Memory"
        NODE6[r6i.xlarge - 1<br/>Caching Layer]
        NODE7[r6i.xlarge - 2<br/>Data Processing]
    end
    
    subgraph "Cluster Add-ons"
        ALBC[AWS Load Balancer<br/>Controller]
        CA[Cluster<br/>Autoscaler]
        ESO[External Secrets<br/>Operator]
        CM2[Cert Manager]
        EXDNS[External DNS]
    end
    
    subgraph "Namespaces"
        NS1[core-services]
        NS2[microservices]
        NS3[data]
        NS4[monitoring]
        NS5[security]
    end
    
    API --> NODE1
    API --> NODE2
    API --> NODE3
    API --> NODE4
    API --> NODE5
    API --> NODE6
    API --> NODE7
    
    ALBC -.manages.-> API
    CA -.scales.-> NODE1
    ESO -.fetches.-> NODE1
    
    NODE1 -.hosts pods.-> NS1
    NODE2 -.hosts pods.-> NS2
    NODE4 -.hosts pods.-> NS2
    NODE6 -.hosts pods.-> NS3
    
    style API fill:#326CE5
    style NODE1 fill:#FF9900
    style NODE4 fill:#FF6B6B
    style NODE6 fill:#9370DB
    style ALBC fill:#90EE90
```

## Monitoring & Observability Flow

```mermaid
graph LR
    subgraph "Application Layer"
        APP1[Microservice 1]
        APP2[Microservice 2]
        APP3[Microservice 3]
    end
    
    subgraph "Metrics Collection"
        APP1 -->|metrics| PROM[Prometheus]
        APP2 -->|metrics| PROM
        APP3 -->|metrics| PROM
    end
    
    subgraph "Logging"
        APP1 -->|logs| FB[Fluent Bit]
        APP2 -->|logs| FB
        APP3 -->|logs| FB
        FB --> CW[CloudWatch Logs]
    end
    
    subgraph "Tracing"
        APP1 -->|traces| XRAY[AWS X-Ray]
        APP2 -->|traces| XRAY
        APP3 -->|traces| XRAY
    end
    
    subgraph "Visualization"
        PROM --> GRAF[Grafana<br/>Dashboards]
        CW --> GRAF
        XRAY --> GRAF
    end
    
    subgraph "Alerting"
        PROM --> AM[Alert Manager]
        CW --> CWALARM[CloudWatch<br/>Alarms]
        AM --> PD[PagerDuty]
        CWALARM --> PD
        AM --> SLACK[Slack]
    end
    
    style APP1 fill:#326CE5
    style PROM fill:#E6522C
    style GRAF fill:#F46800
    style CW fill:#FF4F8B
    style PD fill:#06AC38
```

## High Availability Architecture

```mermaid
graph TB
    subgraph "Global"
        USERS[End Users] --> R53[Route 53<br/>Geo-Routing]
    end
    
    subgraph "Multi-AZ Deployment"
        R53 --> CF[CloudFront<br/>150+ Edge Locations]
        CF --> WAF[AWS WAF]
        WAF --> HCA[Health Check Agent]
        
        subgraph "Availability Zone A"
            HCA --> ALB1[ALB]
            ALB1 --> APP1A[Application<br/>Pods 1-10]
            APP1A --> DB1A[(RDS Primary)]
            APP1A --> CACHE1A[(Redis Primary)]
        end
        
        subgraph "Availability Zone B"
            HCA --> ALB2[ALB]
            ALB2 --> APP1B[Application<br/>Pods 11-20]
            APP1B --> DB1B[(RDS Standby)]
            APP1B --> CACHE1B[(Redis Replica)]
            DB1A -.replication.-> DB1B
            CACHE1A -.replication.-> CACHE1B
        end
        
        subgraph "Availability Zone C"
            HCA --> ALB3[ALB]
            ALB3 --> APP1C[Application<br/>Pods 21-30]
            APP1C --> DB1C[(RDS Read<br/>Replica)]
            APP1C --> CACHE1C[(Redis Replica)]
            DB1A -.replication.-> DB1C
            CACHE1A -.replication.-> CACHE1C
        end
    end
    
    subgraph "Disaster Recovery - Region: EU-WEST-1"
        DB1A -.cross-region<br/>replication.-> DRDB[(RDS Cross<br/>Region Replica)]
        S3A[S3 Bucket] -.cross-region<br/>replication.-> S3DR[S3 Bucket DR]
    end
    
    style DB1A fill:#3B48CC
    style ALB1 fill:#FF9900
    style APP1A fill:#90EE90
    style CF fill:#8C4FFF
    style DRDB fill:#FFD700
```

---

## Legend

### Component Colors
- 🟠 **Orange** - AWS Compute & Core Services
- 🔵 **Blue** - Database Services
- 🟢 **Green** - Storage & Successful States
- 🔴 **Red** - Security & Critical Components
- 🟣 **Purple** - Monitoring & Observability

### Connection Types
- **Solid Arrow** (→) - Direct data flow
- **Dotted Arrow** (-.→) - Asynchronous/Background processes
- **Bold Line** - Primary path
- **Thin Line** - Secondary path

---

## Architecture Highlights

### Scalability
- ✅ Auto-scaling at multiple layers (EKS nodes, pods, databases)
- ✅ Multi-AZ deployment for high availability
- ✅ CloudFront CDN for global content delivery
- ✅ Read replicas for database scaling

### Security
- ✅ AWS WAF protecting ALB
- ✅ Private subnets for application and data tiers
- ✅ Secrets Manager for credential management
- ✅ KMS encryption for data at rest
- ✅ TLS/SSL for data in transit

### Reliability
- ✅ 99.99% uptime SLA
- ✅ Automated failover (RDS, ElastiCache)
- ✅ Health checks and self-healing
- ✅ Cross-region disaster recovery
- ✅ Automated backups and snapshots

### Observability
- ✅ Centralized logging with CloudWatch
- ✅ Metrics collection with Prometheus
- ✅ Distributed tracing with X-Ray
- ✅ Custom Grafana dashboards
- ✅ Real-time alerting via PagerDuty/Slack
