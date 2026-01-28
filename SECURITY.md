# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

### Preferred Method: Encrypted Email
1. Obtain my PGP public key from [keybase.io/pinkoffense2](https://keybase.io/pinkoffense2)
2. Send an encrypted email to: pinkoffenseofficial@gmail.com

### Alternative: Keybase
Contact me directly via Keybase: [keybase.io/pinkoffense2](https://keybase.io/pinkoffense2)

### What to Include
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline
- Initial response: Within 48 hours
- Status update: Within 7 days
- Resolution target: Within 30 days (depending on severity)

### Recognition
Contributors who report valid security vulnerabilities will be acknowledged in this file (with their permission).

## Security Measures

This project implements the following security practices:

### CI/CD Security
- Automated dependency scanning via npm audit
- CodeQL static analysis for security vulnerabilities
- Semgrep SAST scanning
- TruffleHog secret scanning
- Dependency review on pull requests

### Code Security
- ESLint with security rules
- TypeScript strict mode
- No eval() or implied eval
- Readonly data properties

### Web Security Headers
- Content-Security-Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy restrictions

### External Links
- All external links use `rel="noopener noreferrer"`
- No third-party form handlers or analytics

## Hall of Fame

*No vulnerabilities reported yet.*
