# Attack Path Analysis: Chaining Misconfigurations to Domain Compromise

During a recent internal penetration test, what began as a low-severity web application finding quickly escalated into full domain compromise. This post walks through the attack path — from initial access to domain admin — and discusses why individual findings rated "low" or "medium" can combine into critical risk.

## Initial Access: Unauthenticated API Endpoint

The engagement started with a standard web application assessment. During reconnaissance, an undocumented API endpoint was identified that returned internal configuration data without authentication:

```
GET /api/v1/debug/config HTTP/1.1
Host: internal-app.target.local
```

The response included database connection strings with cleartext credentials. On its own, this might be rated as a **Medium** finding — information disclosure via a debug endpoint.

## Lateral Movement: Credential Reuse

The database credentials obtained from the API endpoint were tested against other internal services. The same credentials worked for an MSSQL instance running with `xp_cmdshell` enabled.

This gave us OS-level command execution on the database server, running as a service account.

## Privilege Escalation: Misconfigured Service Account

The service account had **SeImpersonatePrivilege** — a common configuration for SQL Server service accounts. Using this privilege, we escalated to `NT AUTHORITY\SYSTEM` on the database server.

## Domain Compromise: Unconstrained Delegation

The database server was configured with **unconstrained Kerberos delegation**. By coercing authentication from the domain controller (via the printer bug), we captured a TGT for the domain controller's machine account and used it to perform a DCSync attack.

**Total time from initial finding to domain admin: under 2 hours.**

## Key Takeaways

1. **Risk aggregation matters.** Each individual finding was rated medium or lower. The combination was critical.
2. **Debug endpoints in production** are a recurring pattern. Build pipeline checks should flag these.
3. **Credential reuse** between application and infrastructure layers remains one of the most impactful issues we see.
4. **Unconstrained delegation** should be audited regularly. Most environments have forgotten configurations that create unnecessary risk.

## Remediation Recommendations

| Finding | Remediation | Priority |
|---------|------------|----------|
| Debug API exposed | Remove debug endpoints from production builds | High |
| Cleartext credentials in config | Use secrets management (Vault, KMS) | High |
| Credential reuse | Unique credentials per service | Medium |
| SeImpersonatePrivilege | Use managed service accounts (gMSA) | Medium |
| Unconstrained delegation | Migrate to constrained or RBCD | High |

---

*This post is based on anonymized findings from an authorized engagement. All identifying details have been removed.*
