# JWT Implementation Flaws: Assessment Methodology and Remediation

JSON Web Tokens are ubiquitous in modern authentication systems, but their flexibility creates a wide surface for implementation errors. This post outlines a structured approach to assessing JWT security during web application penetration tests.

## Assessment Checklist

When evaluating JWT implementations, we systematically test for the following classes of vulnerabilities:

### 1. Algorithm Confusion (CVE-2015-9235)

The most well-known JWT vulnerability occurs when a server accepts tokens signed with a different algorithm than intended. The classic attack involves changing the algorithm from RS256 (asymmetric) to HS256 (symmetric) and signing with the public key:

```python
# Conceptual example — algorithm confusion
import jwt

public_key = open('public.pem').read()
token = jwt.encode(
    {"sub": "admin", "role": "administrator"},
    public_key,
    algorithm="HS256"
)
```

**Assessment approach:** Modify the `alg` header field and test whether the server validates it strictly.

**Remediation:** Always enforce the expected algorithm server-side. Never derive the verification method from the token itself.

### 2. None Algorithm

Some libraries accept `"alg": "none"` as a valid algorithm, meaning the signature is not verified at all.

**Assessment approach:** Set `alg` to `none`, `None`, `NONE`, and `nOnE`. Remove the signature portion of the token.

**Remediation:** Reject tokens with `none` algorithm. Use an allowlist of accepted algorithms.

### 3. Weak HMAC Secrets

When HS256/HS384/HS512 is used, the security depends entirely on the secret's entropy. Weak secrets can be brute-forced offline.

```bash
# Offline brute-force with hashcat
hashcat -m 16500 jwt.txt wordlist.txt
```

**Assessment approach:** Attempt offline cracking using common wordlists. Check if the secret is a known default value.

**Remediation:** Use secrets with at least 256 bits of entropy. Consider asymmetric algorithms (RS256, ES256) instead.

### 4. Missing Expiration Validation

Tokens without `exp` claims — or servers that don't validate expiration — allow captured tokens to be replayed indefinitely.

**Assessment approach:** Remove or modify the `exp` claim. Test with expired tokens.

**Remediation:** Always set and validate `exp`. Implement reasonable token lifetimes (15 minutes for access tokens).

### 5. Key Injection via JWK/JKU Headers

The `jwk` and `jku` headers allow tokens to specify their own verification key or key URL, enabling an attacker to self-sign tokens.

**Assessment approach:** Embed a custom public key in the `jwk` header. Point `jku` to an attacker-controlled URL.

**Remediation:** Never trust key material from within the token. Use a server-side key store.

## Reporting Template

When reporting JWT findings, include:

- **Vulnerability class** (algorithm confusion, weak secret, etc.)
- **Proof of concept** showing token manipulation and server acceptance
- **Impact statement** — what can an attacker achieve? (privilege escalation, account takeover)
- **Remediation** with specific library configuration examples

## Recommended Libraries and Configuration

| Language | Library | Key Configuration |
|----------|---------|-------------------|
| Node.js | `jose` | `algorithms` allowlist in verify options |
| Python | `PyJWT` | `algorithms` parameter in `jwt.decode()` |
| Java | `nimbus-jose-jwt` | `JWSAlgorithm` validation |
| .NET | `System.IdentityModel.Tokens.Jwt` | `TokenValidationParameters.ValidAlgorithms` |

---

*All techniques described should only be used during authorized security assessments.*
