import { Component, signal } from '@angular/core';

interface Writeup {
  id: string;
  title: string;
  description: string;
  platform: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  tags: string[];
  date: string;
  url?: string;
}

@Component({
  selector: 'app-writeups',
  imports: [],
  templateUrl: './writeups.html',
  styleUrl: './writeups.scss'
})
export class Writeups {
  activeFilter = signal('all');

  platforms = [
    { id: 'all', name: 'All Writeups' },
    { id: 'tryhackme', name: 'TryHackMe' },
    { id: 'hackthebox', name: 'HackTheBox' },
    { id: 'ctf', name: 'CTF' },
    { id: 'research', name: 'Research' }
  ];

  writeups: Writeup[] = [
    // Add your writeups here
    // Example:
    // {
    //   id: 'dvwa-sqli',
    //   title: 'DVWA SQL Injection',
    //   description: 'Complete walkthrough of SQL injection vulnerabilities in DVWA from low to impossible security levels.',
    //   platform: 'tryhackme',
    //   difficulty: 'Easy',
    //   tags: ['SQL Injection', 'Web', 'OWASP'],
    //   date: '2024-01-15',
    //   url: '/blog/dvwa-sqli'
    // }
  ];

  get filteredWriteups(): Writeup[] {
    if (this.activeFilter() === 'all') {
      return this.writeups;
    }
    return this.writeups.filter(w => w.platform === this.activeFilter());
  }

  setFilter(platform: string): void {
    this.activeFilter.set(platform);
  }

  getDifficultyClass(difficulty: string): string {
    return `difficulty--${difficulty.toLowerCase()}`;
  }

  getPlatformIcon(platform: string): string {
    switch (platform) {
      case 'tryhackme': return '🎯';
      case 'hackthebox': return '📦';
      case 'ctf': return '🚩';
      case 'research': return '🔬';
      default: return '📝';
    }
  }
}
