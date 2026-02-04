import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

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
    docs?: string;
    demo?: string;
    writeup?: string;
  };
  featured: boolean;
}

@Component({
  selector: 'app-portfolio',
  imports: [RouterLink],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {
  activeFilter = signal('all');

  categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'guide', name: 'Guides' },
    { id: 'cheatsheet', name: 'Cheat Sheets' },
    { id: 'certification', name: 'Certification Prep' },
    { id: 'fundamentals', name: 'Security Fundamentals' }
  ];

  // GitBook base URL - update this after GitBook sync
  readonly gitbookBase = 'https://app.gitbook.com/o/C4SLjqM3jsSUG0q8KSNr/s/l92m5iq51vnxdrB0qDAD';

  projects: Project[] = [
    {
      id: 'burp-suite-guide',
      title: 'Burp Suite Offensive Guide',
      description: 'Comprehensive Burp Suite guide for red team operations and advanced web application pentesting.',
      longDescription: 'Expert-level guide covering all Burp Suite tools, extensions, evasion techniques, attack chaining, payload development, API hacking, and red team operations.',
      image: '',
      tags: ['Burp Suite', 'Web AppSec', 'Red Team', 'Pentesting'],
      category: 'guide',
      links: {
        github: 'https://github.com/PinkOffense/burp-suite-guide',
        demo: '/guides/burp-suite'
      },
      featured: true
    },
    {
      id: 'ports-cheatsheet',
      title: 'Ports Cheatsheet',
      description: 'Quick reference guide for common ports, services, and their security implications.',
      longDescription: 'Comprehensive cheatsheet covering well-known ports, their associated services, common vulnerabilities, and pentesting tips for each service.',
      image: '',
      tags: ['Cheatsheet', 'Networking', 'Pentesting', 'Reference'],
      category: 'cheatsheet',
      links: {
        github: 'https://github.com/PinkOffense/Ports-cheatsheet',
        docs: 'https://app.gitbook.com/o/C4SLjqM3jsSUG0q8KSNr/s/l92m5iq51vnxdrB0qDAD'
      },
      featured: true
    },
    {
      id: 'ceh-playbook',
      title: 'CEH Practical Playbook',
      description: 'Complete playbook for CEH Practical exam preparation with hands-on techniques.',
      longDescription: 'Step-by-step guide covering all CEH Practical exam domains including reconnaissance, scanning, enumeration, exploitation, and reporting.',
      image: '',
      tags: ['CEH', 'Certification', 'Playbook', 'Ethical Hacking'],
      category: 'certification',
      links: {
        github: 'https://github.com/PinkOffense/CEH_Practical_Playbook'
      },
      featured: true
    },
    {
      id: 'threat-modeling',
      title: 'Threat Modeling Playbook',
      description: 'Structured approach to identifying and mitigating security threats in applications.',
      longDescription: 'Comprehensive guide to threat modeling methodologies including STRIDE, DREAD, attack trees, and practical examples for real-world applications.',
      image: '',
      tags: ['Threat Modeling', 'AppSec', 'STRIDE', 'Security Design'],
      category: 'fundamentals',
      links: {
        github: 'https://github.com/PinkOffense/Threat-modeling-playbook'
      },
      featured: true
    },
    {
      id: 'mysql-security',
      title: 'MySQL Security Playbook',
      description: 'SQL security playbook focused on MySQL with offensive and defensive techniques.',
      longDescription: 'In-depth guide covering SQL injection techniques, database hardening, privilege escalation, and secure coding practices for MySQL environments.',
      image: '',
      tags: ['MySQL', 'SQL Injection', 'Database Security', 'Hardening'],
      category: 'fundamentals',
      links: {
        github: 'https://github.com/PinkOffense/MySQL-Cybersecurity-Playbook'
      },
      featured: true
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
