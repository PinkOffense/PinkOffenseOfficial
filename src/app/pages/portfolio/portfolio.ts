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
    docs?: string;
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
    { id: 'all', name: 'All Resources' },
    { id: 'cheatsheet', name: 'Quick Reference' },
    { id: 'methodology', name: 'Methodologies' },
    { id: 'fundamentals', name: 'Security Fundamentals' }
  ];

  // GitBook base URL - update this after GitBook sync
  readonly gitbookBase = 'https://app.gitbook.com/o/C4SLjqM3jsSUG0q8KSNr/s/l92m5iq51vnxdrB0qDAD';

  projects: Project[] = [
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
      title: 'Penetration Testing Playbook',
      description: 'End-to-end methodology covering reconnaissance, enumeration, exploitation, and professional reporting.',
      longDescription: 'Step-by-step guide covering all penetration testing phases including reconnaissance, scanning, enumeration, exploitation, post-exploitation, and executive reporting.',
      image: '',
      tags: ['Pentesting', 'Methodology', 'Playbook', 'PTES'],
      category: 'methodology',
      links: {
        github: 'https://github.com/PinkOffense/CEH_Practical_Playbook'
      },
      featured: true
    },
    {
      id: 'threat-modeling',
      title: 'Threat Modeling Playbook',
      description: 'Structured approach to threat identification and risk prioritization for application security.',
      longDescription: 'Comprehensive guide to threat modeling methodologies including STRIDE, DREAD, attack trees, and practical examples for enterprise applications.',
      image: '',
      tags: ['Threat Modeling', 'STRIDE', 'Risk Assessment', 'Security Architecture'],
      category: 'methodology',
      links: {
        github: 'https://github.com/PinkOffense/Threat-modeling-playbook'
      },
      featured: true
    },
    {
      id: 'mysql-security',
      title: 'MySQL Security Playbook',
      description: 'Database security assessment guide covering SQL injection vectors, privilege escalation, and hardening best practices.',
      longDescription: 'In-depth guide covering SQL injection techniques, database hardening, privilege escalation, and secure configuration practices for MySQL environments in enterprise deployments.',
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
