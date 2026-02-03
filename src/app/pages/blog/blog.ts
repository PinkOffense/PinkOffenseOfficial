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
    { id: 'technical-analysis', name: 'Technical Analysis' },
    { id: 'research', name: 'Research' },
    { id: 'methodology', name: 'Methodology' },
    { id: 'industry', name: 'Industry Insights' }
  ];

  posts: BlogPost[] = [
    {
      id: 'attack-path-analysis',
      title: 'Attack Path Analysis: Chaining Misconfigurations to Domain Compromise',
      excerpt: 'A case study on how seemingly low-risk findings — web application flaws combined with privilege escalation vectors — can lead to full domain compromise.',
      date: '2026-01-15',
      readTime: '12 min read',
      category: 'technical-analysis',
      tags: ['Attack Path', 'Active Directory', 'Privilege Escalation'],
      featured: true
    },
    {
      id: 'jwt-vulnerabilities',
      title: 'JWT Implementation Flaws: Assessment Methodology and Remediation',
      excerpt: 'A structured approach to identifying JWT security weaknesses including algorithm confusion, key management issues, and token validation bypasses.',
      date: '2026-01-10',
      readTime: '8 min read',
      category: 'research',
      tags: ['JWT', 'Authentication', 'Web Security'],
      featured: true
    },
    {
      id: 'web-app-assessment-methodology',
      title: 'Structuring a Web Application Penetration Test: A Practical Methodology',
      excerpt: 'How to scope, execute, and report on web application security assessments aligned with OWASP Testing Guide and PTES.',
      date: '2026-01-05',
      readTime: '15 min read',
      category: 'methodology',
      tags: ['OWASP', 'PTES', 'Web App Testing'],
      featured: false
    },
    {
      id: 'sql-injection-deep-dive',
      title: 'Advanced SQL Injection: WAF Bypass Techniques and Remediation Strategies',
      excerpt: 'Analysis of blind SQLi, time-based attacks, and WAF evasion methods — with practical remediation guidance for development teams.',
      date: '2025-12-28',
      readTime: '20 min read',
      category: 'technical-analysis',
      tags: ['SQL Injection', 'Web Security', 'OWASP'],
      featured: false
    },
    {
      id: 'cve-analysis',
      title: 'CVE Root Cause Analysis: Understanding a Critical RCE Vulnerability',
      excerpt: 'Deep dive into a recently disclosed remote code execution vulnerability — root cause analysis, impact assessment, and organizational defense strategies.',
      date: '2025-12-20',
      readTime: '10 min read',
      category: 'research',
      tags: ['CVE', 'RCE', 'Vulnerability Analysis'],
      featured: false
    },
    {
      id: 'threat-landscape-review',
      title: 'Threat Landscape Review: Key Trends for Security Teams — January 2026',
      excerpt: 'Monthly analysis of significant security events, emerging attack vectors, and actionable intelligence for defensive teams.',
      date: '2026-01-20',
      readTime: '5 min read',
      category: 'industry',
      tags: ['Threat Intelligence', 'Industry', 'Trends'],
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
