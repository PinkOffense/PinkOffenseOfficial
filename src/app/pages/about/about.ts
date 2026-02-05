import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  private platformId = inject(PLATFORM_ID);

  pgpCopied = signal(false);

  readonly skills = [
    { category: 'Reconnaissance', items: ['Nmap', 'Nikto', 'Gobuster / Dirb', 'enum4linux'] },
    { category: 'Exploitation', items: ['Metasploit Framework', 'SQLMap', 'Searchsploit', 'Hydra / John the Ripper'] },
    { category: 'Web Application', items: ['Burp Suite Community', 'OWASP ZAP', 'OWASP Top 10', 'SQL Injection / XSS'] },
    { category: 'Post-Exploitation', items: ['Netcat', 'LinPEAS / WinPEAS', 'Privilege Escalation', 'Python / Bash Scripting'] }
  ] as const;

  readonly certifications = [
    { name: 'CEH Practical', full: 'Certified Ethical Hacker Practical', status: 'In Progress' },
    { name: 'Jr Pentester', full: 'TryHackMe Jr Penetration Tester Path', status: 'In Progress' }
  ] as const;

  private readonly pgpPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v2.1.17
Comment: https://keybase.io/crypto

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
CXqB+I2Xc0Oi0J75
=uaao
-----END PGP PUBLIC KEY BLOCK-----`;

  copyPgpKey(): void {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(this.pgpPublicKey)
        .then(() => {
          this.pgpCopied.set(true);
          setTimeout(() => this.pgpCopied.set(false), 2000);
        })
        .catch(() => {
          // Fallback: create textarea and copy
          const textarea = document.createElement('textarea');
          textarea.value = this.pgpPublicKey;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            this.pgpCopied.set(true);
            setTimeout(() => this.pgpCopied.set(false), 2000);
          } finally {
            document.body.removeChild(textarea);
          }
        });
    }
  }
}
