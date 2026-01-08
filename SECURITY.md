# Security Best Practices - Learning Hub Platform

## Overview

This document outlines security best practices for the Learning Hub microservices platform, focusing on credential management, authentication, data protection, and secure deployment strategies.

## Credential Management

### Environment Variables

**NEVER commit sensitive credentials to version control.**

#### Development Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update all placeholder values with actual credentials
3. Ensure `.env` is in `.gitignore` (already configured)

#### Production Setup
Use a secrets management service:
- **AWS**: AWS Secrets Manager or Systems Manager Parameter Store
- **Azure**: Azure Key Vault  
- **GCP**: Google Cloud Secret Manager
- **Kubernetes**: Kubernetes Secrets with encryption at rest
- **Self-hosted**: HashiCorp Vault

### JWT Secret Generation

Generate a cryptographically secure JWT secret:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32

# PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Database Credentials

- Use strong passwords (minimum 16 characters, mixed case, numbers, symbols)
- Rotate passwords regularly (every 90 days recommended)
- Use different credentials for dev/staging/production
- Enable PostgreSQL SSL connections in production

### RabbitMQ Credentials

- Change default `guest/guest` credentials immediately
- Create service-specific users with limited permissions
- Use RabbitMQ access control lists (ACLs)
- Enable TLS for RabbitMQ connections

## Authentication & Authorization

### JWT Token Security

- **Expiration**: Set short expiration times (15-30 minutes for access tokens)
- **Refresh Tokens**: Use longer-lived refresh tokens (7 days) stored securely
- **Token Revocation**: Implement token blacklist in Redis for logout
- **Algorithm**: Use RS256 (asymmetric) instead of HS256 for better security

### Password Security

- **Hashing**: Use bcrypt with salt rounds ≥ 12
- **Password Policy**: 
  - Minimum 10 characters
  - Require uppercase, lowercase, numbers, symbols
  - Check against common password lists
- **Rate Limiting**: Limit login attempts (5 per 15 minutes)
- **2FA**: Implement two-factor authentication for admin accounts

## API Security

### CORS Configuration

Properly configure CORS to prevent unauthorized access:

```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600, // Cache preflight requests
});
```

### Rate Limiting

Implement tiered rate limiting:
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour  
- Admin users: 10000 requests/hour

### Input Validation

- Use class-validator decorators on all DTOs
- Sanitize user input to prevent XSS
- Use parameterized queries (Prisma does this automatically)
- Validate file uploads (type, size, content)

## Data Protection

### Encryption at Rest

- Enable PostgreSQL Transparent Data Encryption (TDE)
- Encrypt sensitive fields in database (PII, payment info)
- Use AWS KMS for encryption key management

### Encryption in Transit

- Use TLS 1.3 for all connections
- Force HTTPS redirect in production
- Use certificate pinning for mobile apps
- Enable HSTS headers

### Sensitive Data Handling

- Never log sensitive data (passwords, tokens, credit cards)
- Redact PII in logs and error messages
- Implement data anonymization for analytics
- Follow GDPR/CCPA compliance requirements

## Dependency Security

### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### Supply Chain Security

- Use `npm ci` instead of `npm install` in CI/CD
- Verify package integrity with lock files
- Review dependencies before adding new packages
- Use tools like Snyk or Dependabot

## Deployment Security

### Docker Security

- Use official base images only
- Run containers as non-root user
- Scan images for vulnerabilities
- Keep base images updated
- Use multi-stage builds to reduce attack surface

### Kubernetes Security

- Enable Pod Security Policies
- Use Network Policies to isolate services
- Implement Service Mesh (Istio) for mTLS
- Use Secrets instead of ConfigMaps for sensitive data
- Enable RBAC and least privilege access

### AWS Security

- Use IAM roles instead of access keys
- Enable VPC for network isolation
- Use Security Groups as firewall
- Enable CloudTrail for audit logging
- Use WAF to protect against OWASP Top 10
- Enable GuardDuty for threat detection

## Monitoring & Incident Response

### Security Monitoring

- Log all authentication attempts
- Monitor for unusual API activity
- Set up alerts for failed login spikes
- Track API rate limit violations
- Monitor database query patterns

### Incident Response Plan

1. **Detection**: Automated alerts for security events
2. **Containment**: Isolate affected services
3. **Investigation**: Analyze logs and traces
4. **Remediation**: Patch vulnerabilities, rotate credentials
5. **Recovery**: Restore services, verify integrity
6. **Post-mortem**: Document lessons learned

### Security Audit Checklist

- [ ] All default credentials changed
- [ ] .env file not committed to git
- [ ] JWT secret is cryptographically secure
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] TLS enabled for all connections
- [ ] Database credentials rotated
- [ ] Dependencies updated and scanned
- [ ] Security headers configured
- [ ] Logging and monitoring enabled
- [ ] Incident response plan documented

## Security Headers

Configure security headers in API Gateway:

```typescript
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
  },
}));
```

## Compliance

### GDPR Requirements

- Implement user data export
- Support right to deletion
- Maintain consent records
- Pseudonymize personal data
- Implement data retention policies

### PCI DSS (if handling payments)

- Never store CVV/CVC codes
- Use Stripe's tokenization
- Encrypt cardholder data
- Maintain access logs
- Restrict access to payment data

## Contact

For security issues, contact: **security@learninghub.com**

For bug bounty program, visit: **https://learninghub.com/security**

---

**Last Updated**: 2026-01-07
**Next Review**: 2026-04-07
