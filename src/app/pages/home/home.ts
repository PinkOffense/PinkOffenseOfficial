import { Component, signal, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BunnyScene } from '../../three/bunny-scene/bunny-scene';

@Component({
  selector: 'app-home',
  imports: [RouterLink, BunnyScene],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private typewriterInterval: ReturnType<typeof setInterval> | null = null;

  typedText = signal('');
  showCursor = signal(true);

  private fullText = 'Identifying vulnerabilities before adversaries do';
  private charIndex = 0;

  skills = [
    { name: 'Penetration Testing', icon: '🔓' },
    { name: 'Red Team Operations', icon: '🎯' },
    { name: 'Web App Security', icon: '🌐' },
    { name: 'Vulnerability Assessment', icon: '🔍' },
    { name: 'Security Architecture Review', icon: '🛡️' },
    { name: 'Threat Modeling', icon: '📐' }
  ];

  featuredProjects = [
    {
      title: 'Threat Modeling Playbook',
      description: 'Structured methodology for identifying and mitigating threats using STRIDE, DREAD, and attack trees.',
      tags: ['STRIDE', 'Threat Analysis', 'Risk Assessment']
    },
    {
      title: 'Security Assessment Frameworks',
      description: 'Open-source playbooks aligned with PTES and OWASP Testing Guide for consistent, repeatable assessments.',
      tags: ['PTES', 'OWASP', 'Methodology']
    },
    {
      title: 'Vulnerability Research',
      description: 'Technical analysis of CVEs, root cause breakdowns, and proof-of-concept development.',
      tags: ['CVE Analysis', 'AppSec', 'Research']
    }
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startTypewriter();
    }
  }

  ngOnDestroy(): void {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }
  }

  private startTypewriter(): void {
    this.typewriterInterval = setInterval(() => {
      if (this.charIndex < this.fullText.length) {
        this.typedText.update(text => text + this.fullText.charAt(this.charIndex));
        this.charIndex++;
      } else {
        if (this.typewriterInterval) {
          clearInterval(this.typewriterInterval);
        }
      }
    }, 50);
  }
}
