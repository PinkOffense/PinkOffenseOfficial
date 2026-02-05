import { Component } from '@angular/core';
import { BunnyScene } from '../../three/bunny-scene/bunny-scene';

@Component({
  selector: 'app-about',
  imports: [BunnyScene],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  readonly skills = [
    { category: 'Reconnaissance', items: ['Nmap', 'Nikto', 'Gobuster / Dirb', 'enum4linux'] },
    { category: 'Exploitation', items: ['Metasploit Framework', 'SQLMap', 'Searchsploit', 'Hydra / John the Ripper'] },
    { category: 'Web Application', items: ['Burp Suite Community', 'OWASP ZAP', 'OWASP Top 10', 'SQL Injection / XSS'] },
    { category: 'Post-Exploitation', items: ['Netcat', 'LinPEAS / WinPEAS', 'Privilege Escalation', 'Python / Bash Scripting'] }
  ] as const;

  readonly certifications = [
    { name: 'CEH Practical', full: 'Certified Ethical Hacker Practical', status: 'In Progress' },
    { name: 'CompTIA CySA+', full: 'CompTIA Cybersecurity Analyst', status: 'In Progress' },
    { name: 'ISO 27001', full: 'ISO/IEC 27001 Lead Implementer', status: 'In Progress' }
  ] as const;
}
