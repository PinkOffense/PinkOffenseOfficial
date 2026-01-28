import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  formSubmitted = signal(false);

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

  socialLinks = [
    { name: 'GitHub', url: 'https://github.com/PinkOffense', icon: 'github' }
  ];

  onSubmit(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
  }
}
