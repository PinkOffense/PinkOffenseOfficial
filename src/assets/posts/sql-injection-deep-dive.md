# Advanced SQL Injection: WAF Bypass Techniques and Remediation Strategies

SQL injection remains a top-tier vulnerability despite decades of awareness. This post covers advanced exploitation techniques observed during assessments, WAF evasion methods, and — critically — remediation strategies for development teams.

## Beyond the Basics

Most developers understand the classic `' OR 1=1 --` pattern. Real-world SQL injection in modern applications is more nuanced and often requires bypassing defensive layers.

## Time-Based Blind Extraction

When the application returns no visible errors or data differences, time-based techniques can still confirm and exploit injection:

```sql
-- MySQL time-based extraction
' AND IF(SUBSTRING(database(),1,1)='a', SLEEP(5), 0)-- -

-- MSSQL equivalent
'; IF (SELECT SUBSTRING(db_name(),1,1))='a' WAITFOR DELAY '0:0:5'-- -
```

## WAF Bypass Techniques

Common WAF bypass patterns observed during engagements:

### Encoding Variations
- URL encoding: `%27%20OR%201%3D1`
- Double encoding: `%2527`
- Unicode: `%u0027`

### Syntax Alternatives
- Replace spaces with comments: `/**/`
- Use `HAVING` instead of `WHERE`
- Alternative string concatenation: `CONCAT()`, `||`, `+`

### Case and Function Manipulation
- Mixed case: `sElEcT`
- Equivalent functions: `MID()` instead of `SUBSTRING()`
- Mathematical expressions: `OR 2>1` instead of `OR 1=1`

## Remediation for Development Teams

### Parameterized Queries (Primary Defense)

Every SQL interaction should use parameterized queries:

```python
# Correct - parameterized
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# Incorrect - string concatenation
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
```

### Defense in Depth

- **Input validation** — allowlist expected characters and formats
- **Least privilege** — database accounts should have minimal permissions
- **Stored procedures** — reduce direct SQL exposure
- **WAF rules** — useful as an additional layer, never as the only defense

---

*All techniques described are for authorized testing only. Effective remediation requires development team involvement, not just WAF rules.*
