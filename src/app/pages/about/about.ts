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

  skills = [
    { category: 'Offensive Security', items: ['Penetration Testing', 'Red Team Operations', 'Vulnerability Analysis', 'Exploit Development'] },
    { category: 'Application Security', items: ['Web App Pentesting', 'API Security', 'OWASP Top 10', 'Secure Code Review'] },
    { category: 'Tools', items: ['Burp Suite', 'Metasploit', 'Nmap', 'Wireshark', 'Ghidra'] },
    { category: 'Platforms', items: ['TryHackMe', 'HackTheBox', 'CTF Competitions', 'Vulnerable Labs'] }
  ];

  certifications = [
    { name: 'CEH Practical', full: 'Certified Ethical Hacker Practical', status: 'In Progress' },
    { name: 'THM Jr Pentester', full: 'TryHackMe Jr Penetration Tester Path', status: 'In Progress' }
  ];

  timeline = [
    { year: 'Now', title: 'Jr Pentester & Security Researcher', description: 'Focused on penetration testing, red team operations, and vulnerability analysis.' },
    { year: '2024', title: 'Security Journey', description: 'Computer Engineer diving deep into offensive security and AppSec.' }
  ];

  // PGP Public Key - Replace with your actual key when you generate one
  pgpPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
[Your PGP public key will go here]
[Generate one at: https://www.openpgp.org/software/]
-----END PGP PUBLIC KEY BLOCK-----`;

  copyPgpKey(): void {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(this.pgpPublicKey).then(() => {
        this.pgpCopied.set(true);
        setTimeout(() => this.pgpCopied.set(false), 2000);
      });
    }
  }
}
