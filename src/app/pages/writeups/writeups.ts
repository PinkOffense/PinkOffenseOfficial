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
  status?: 'Completed' | 'In Progress';
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
    {
      id: 'advent-of-cyber-2024',
      title: 'Advent of Cyber 2024',
      description: 'Completed the TryHackMe Christmas challenge covering various security topics including web exploitation, forensics, and malware analysis.',
      platform: 'tryhackme',
      difficulty: 'Easy',
      tags: ['Web', 'Forensics', 'Malware', 'OSINT'],
      date: '2024-12-25',
      url: 'https://tryhackme.com/r/christmas',
      status: 'Completed'
    },
    {
      id: 'jr-pentester-path',
      title: 'Jr Penetration Tester Path',
      description: 'Learning path covering pentesting fundamentals, web application security, Burp Suite, network security, and privilege escalation techniques.',
      platform: 'tryhackme',
      difficulty: 'Medium',
      tags: ['Pentesting', 'Web AppSec', 'Network', 'Privilege Escalation'],
      date: '2025-02-05',
      url: 'https://tryhackme.com/r/path/jrpenetrationtester',
      status: 'In Progress'
    }
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
