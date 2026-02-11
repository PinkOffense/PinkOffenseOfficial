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
    { category: 'Security Learning', items: ['TryHackMe & CTF Challenges', 'Hands-on Lab Environments', 'Vulnerability Research', 'Security Tool Exploration'] },
    { category: 'Professional Background', items: ['Quality Assurance Management', 'Test Strategy & Planning', 'Software Testing (Manual & Automated)', 'Bug Tracking & Quality Processes'] },
    { category: 'Tools & Technologies', items: ['Burp Suite', 'Nmap & Wireshark', 'Kali Linux', 'Test Automation Frameworks'] },
    { category: 'Standards & Frameworks', items: ['ISTQB / CTFL Methodology', 'OWASP Top 10', 'ISO 27001 Awareness', 'Agile & DevOps Practices'] }
  ] as const;

  readonly certifications = [
    { name: 'CTFL', full: 'ISTQB Certified Tester Foundation Level', status: 'Completed' },
    { name: 'CEH Practical', full: 'Certified Ethical Hacker Practical', status: 'In Progress' },
    { name: 'CySA+', full: 'CompTIA Cybersecurity Analyst', status: 'In Progress' },
    { name: 'ISO 27001', full: 'Information Security Management', status: 'In Progress' }
  ] as const;
}
