import { Component, signal } from '@angular/core';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  category: string;
  links: {
    github?: string;
    demo?: string;
    writeup?: string;
  };
  featured: boolean;
}

@Component({
  selector: 'app-portfolio',
  imports: [],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {
  activeFilter = signal('all');

  categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'tools', name: 'Security Tools' },
    { id: 'research', name: 'Research' },
    { id: 'ctf', name: 'CTF Writeups' },
    { id: 'web', name: 'Web Security' }
  ];

  projects: Project[] = [
    {
      id: 'vuln-scanner',
      title: 'VulnScanner Pro',
      description: 'Automated vulnerability detection tool for web applications with custom rule engine.',
      longDescription: 'A comprehensive security scanning tool that identifies OWASP Top 10 vulnerabilities...',
      image: '',
      tags: ['Python', 'Security', 'Automation', 'API'],
      category: 'tools',
      links: {
        github: 'https://github.com/PinkOffense'
      },
      featured: true
    },
    {
      id: 'malware-sandbox',
      title: 'Malware Sandbox',
      description: 'Isolated environment for safe malware analysis and behavior monitoring.',
      longDescription: 'Dockerized sandbox environment with network isolation for analyzing suspicious files...',
      image: '',
      tags: ['Docker', 'Python', 'Malware Analysis'],
      category: 'tools',
      links: {
        github: 'https://github.com/PinkOffense'
      },
      featured: true
    },
    {
      id: 'ctf-htb-machines',
      title: 'HackTheBox Writeups',
      description: 'Detailed writeups for various HackTheBox machines and challenges.',
      longDescription: 'Collection of step-by-step guides for solving HTB machines...',
      image: '',
      tags: ['CTF', 'Pentesting', 'Writeups'],
      category: 'ctf',
      links: {
        writeup: '/blog'
      },
      featured: true
    },
    {
      id: 'xss-research',
      title: 'XSS Filter Bypass Research',
      description: 'Research on bypassing modern XSS filters and WAF protections.',
      longDescription: 'In-depth analysis of various WAF bypass techniques...',
      image: '',
      tags: ['Research', 'XSS', 'WAF Bypass'],
      category: 'research',
      links: {},
      featured: false
    },
    {
      id: 'api-fuzzer',
      title: 'API Fuzzer',
      description: 'Intelligent API endpoint fuzzer with automatic parameter discovery.',
      longDescription: 'REST API security testing tool with smart fuzzing capabilities...',
      image: '',
      tags: ['Go', 'API Security', 'Fuzzing'],
      category: 'tools',
      links: {
        github: 'https://github.com/PinkOffense'
      },
      featured: false
    },
    {
      id: 'jwt-toolkit',
      title: 'JWT Security Toolkit',
      description: 'Tools for testing JWT implementation vulnerabilities.',
      longDescription: 'Comprehensive toolkit for identifying JWT misconfigurations...',
      image: '',
      tags: ['Python', 'JWT', 'Authentication'],
      category: 'web',
      links: {
        github: 'https://github.com/PinkOffense'
      },
      featured: false
    }
  ];

  get filteredProjects(): Project[] {
    if (this.activeFilter() === 'all') {
      return this.projects;
    }
    return this.projects.filter(p => p.category === this.activeFilter());
  }

  setFilter(category: string): void {
    this.activeFilter.set(category);
  }
}
