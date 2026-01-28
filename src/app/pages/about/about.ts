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
    { category: 'Offensive Security', items: ['Penetration Testing', 'Red Team Operations', 'Exploit Development', 'Social Engineering'] },
    { category: 'Web Security', items: ['OWASP Top 10', 'API Security', 'Authentication Bypass', 'XSS/SQLi/CSRF'] },
    { category: 'Tools & Frameworks', items: ['Burp Suite', 'Metasploit', 'Nmap', 'Wireshark', 'Ghidra'] },
    { category: 'Programming', items: ['Python', 'JavaScript', 'Go', 'Bash', 'Assembly'] }
  ];

  certifications = [
    { name: 'OSCP', full: 'Offensive Security Certified Professional', status: 'In Progress' },
    { name: 'CEH', full: 'Certified Ethical Hacker', status: 'Certified' },
    { name: 'CompTIA Security+', full: 'CompTIA Security+', status: 'Certified' }
  ];

  timeline = [
    { year: '2024', title: 'Security Researcher', description: 'Started independent security research and bug bounty hunting.' },
    { year: '2023', title: 'CTF Competitor', description: 'Began competing in capture the flag competitions.' },
    { year: '2022', title: 'Learning Journey', description: 'Started learning cybersecurity through self-study and online courses.' }
  ];

  socialLinks = [
    { name: 'GitHub', url: 'https://github.com/PinkOffense', icon: 'github' },
    { name: 'LinkedIn', url: '#', icon: 'linkedin' },
    { name: 'Twitter', url: '#', icon: 'twitter' },
    { name: 'HackTheBox', url: '#', icon: 'htb' }
  ];

  onSubmit(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
  }
}
