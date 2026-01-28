import { Component, signal } from '@angular/core';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
}

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog {
  activeCategory = signal('all');

  categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'ctf', name: 'CTF Writeups' },
    { id: 'research', name: 'Research' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'news', name: 'Security News' }
  ];

  posts: BlogPost[] = [
    {
      id: 'htb-machine-writeup',
      title: 'HackTheBox: Pwning the "CyberVault" Machine',
      excerpt: 'A detailed walkthrough of exploiting a vulnerable web application and escalating privileges to root on this medium-difficulty HTB machine.',
      date: '2026-01-15',
      readTime: '12 min read',
      category: 'ctf',
      tags: ['HackTheBox', 'Linux', 'Privilege Escalation'],
      featured: true
    },
    {
      id: 'jwt-vulnerabilities',
      title: 'Common JWT Security Vulnerabilities and How to Exploit Them',
      excerpt: 'Exploring the most common JWT implementation flaws including algorithm confusion, weak secrets, and improper validation.',
      date: '2026-01-10',
      readTime: '8 min read',
      category: 'research',
      tags: ['JWT', 'Authentication', 'Web Security'],
      featured: true
    },
    {
      id: 'burp-suite-guide',
      title: 'Getting Started with Burp Suite for Web App Testing',
      excerpt: 'A beginner-friendly guide to setting up and using Burp Suite for web application penetration testing.',
      date: '2026-01-05',
      readTime: '15 min read',
      category: 'tutorials',
      tags: ['Burp Suite', 'Tools', 'Web Testing'],
      featured: false
    },
    {
      id: 'sql-injection-deep-dive',
      title: 'SQL Injection: From Basics to Advanced Exploitation',
      excerpt: 'Comprehensive guide covering blind SQLi, time-based attacks, and advanced WAF bypass techniques.',
      date: '2025-12-28',
      readTime: '20 min read',
      category: 'tutorials',
      tags: ['SQL Injection', 'Web Security', 'OWASP'],
      featured: false
    },
    {
      id: 'cve-analysis',
      title: 'Analyzing CVE-2025-XXXXX: A Critical RCE Vulnerability',
      excerpt: 'Deep dive into a recently disclosed remote code execution vulnerability, including root cause analysis and PoC development.',
      date: '2025-12-20',
      readTime: '10 min read',
      category: 'research',
      tags: ['CVE', 'RCE', 'Vulnerability Analysis'],
      featured: false
    },
    {
      id: 'security-news-roundup',
      title: 'Security News Roundup: January 2026',
      excerpt: 'Monthly roundup of the most significant security events, breaches, and vulnerability disclosures.',
      date: '2026-01-20',
      readTime: '5 min read',
      category: 'news',
      tags: ['News', 'Industry', 'Breaches'],
      featured: false
    }
  ];

  get filteredPosts(): BlogPost[] {
    if (this.activeCategory() === 'all') {
      return this.posts;
    }
    return this.posts.filter(p => p.category === this.activeCategory());
  }

  get featuredPosts(): BlogPost[] {
    return this.posts.filter(p => p.featured);
  }

  setCategory(category: string): void {
    this.activeCategory.set(category);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
