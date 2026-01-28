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
    { category: 'Security', items: ['Penetration Testing', 'Web Security', 'Vulnerability Assessment', 'Security Testing'] },
    { category: 'QA & Testing', items: ['Test Automation', 'Bug Hunting', 'Quality Assurance', 'Test Planning'] },
    { category: 'Tools', items: ['Burp Suite', 'Nmap', 'OWASP ZAP', 'Postman'] },
    { category: 'Learning', items: ['CTF Challenges', 'HackTheBox', 'TryHackMe', 'Security Research'] }
  ];

  certifications = [
    { name: 'Learning', full: 'Currently expanding my security knowledge', status: 'In Progress' }
  ];

  timeline = [
    { year: 'Now', title: 'QA Engineer & Aspiring Pentester', description: 'Working in QA while building security skills on the side.' },
    { year: '2024', title: 'Security Journey', description: 'Started learning penetration testing and participating in CTFs.' }
  ];

  socialLinks = [
    { name: 'GitHub', url: 'https://github.com/PinkOffense', icon: 'github' }
  ];

  onSubmit(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
  }
}
