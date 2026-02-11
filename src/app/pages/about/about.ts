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
    { category: 'Reconnaissance', items: ['Nmap', 'Nikto', 'Gobuster / Dirb', 'OSINT & Enumeration'] },
    { category: 'Exploitation', items: ['Metasploit Framework', 'SQLMap', 'Searchsploit', 'Hydra / John the Ripper'] },
    { category: 'Web Application', items: ['Burp Suite', 'OWASP ZAP', 'OWASP Top 10', 'SQL Injection / XSS'] },
    { category: 'Post-Exploitation', items: ['LinPEAS / WinPEAS', 'Privilege Escalation', 'Active Directory Attacks', 'Python / Bash Scripting'] }
  ] as const;

  readonly certifications = [
    { name: 'CTFL', full: 'ISTQB Certified Tester Foundation Level', status: 'Completed' },
    { name: 'CEH Practical', full: 'Certified Ethical Hacker Practical', status: 'In Progress' },
    { name: 'CySA+', full: 'CompTIA Cybersecurity Analyst', status: 'In Progress' },
    { name: 'ISO 27001', full: 'Information Security Management', status: 'In Progress' }
  ] as const;
}
