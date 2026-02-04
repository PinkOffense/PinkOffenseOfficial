# Structuring a Web Application Penetration Test: A Practical Methodology

A well-structured web application penetration test follows a repeatable methodology that ensures coverage and produces actionable results. This post outlines the approach I use, aligned with the OWASP Testing Guide v4 and PTES.

## Phase 1: Scoping and Pre-Engagement

Before any testing begins, define:

- **Target URLs and domains** in scope
- **Authentication levels** to test (unauthenticated, standard user, admin)
- **Out-of-scope functionality** (payment processors, third-party integrations)
- **Rules of engagement** (testing hours, rate limits, data handling)

## Phase 2: Reconnaissance

Map the application's attack surface:

- Spider/crawl the application to identify all endpoints
- Review `robots.txt`, `sitemap.xml`, and JavaScript files for hidden routes
- Identify technology stack (frameworks, libraries, server software)
- Enumerate API endpoints and parameters

## Phase 3: Authentication and Session Management

Test the authentication layer systematically:

- Password policy enforcement
- Account lockout mechanisms
- Session token entropy and lifecycle
- Multi-factor authentication bypass vectors
- OAuth/OIDC implementation flaws

## Phase 4: Authorization Testing

Verify access controls at every level:

- Horizontal privilege escalation (accessing other users' data)
- Vertical privilege escalation (accessing admin functionality)
- IDOR (Insecure Direct Object References) across all endpoints
- API-level authorization vs. UI-level restrictions

## Phase 5: Input Validation

Test all input vectors for injection flaws:

- SQL injection (error-based, blind, time-based)
- Cross-site scripting (reflected, stored, DOM-based)
- Server-side template injection
- Command injection
- Path traversal

## Phase 6: Business Logic

Identify logic flaws specific to the application's purpose:

- Price manipulation in e-commerce flows
- Workflow bypass (skipping required steps)
- Race conditions in concurrent operations
- Rate limiting and abuse prevention

## Phase 7: Reporting

Deliver findings that enable action:

- **Executive summary** for leadership
- **Technical findings** with reproduction steps
- **Risk ratings** using CVSS or a contextual framework
- **Remediation guidance** with code-level examples where applicable

---

*A structured methodology ensures consistent quality across engagements and makes findings defensible during review.*
