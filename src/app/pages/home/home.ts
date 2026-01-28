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

  private fullText = 'Breaking things to make them stronger';
  private charIndex = 0;

  skills = [
    { name: 'Penetration Testing', icon: '🔓' },
    { name: 'Vulnerability Research', icon: '🔍' },
    { name: 'Malware Analysis', icon: '🦠' },
    { name: 'Web Application Security', icon: '🌐' },
    { name: 'Network Security', icon: '📡' },
    { name: 'Reverse Engineering', icon: '⚙️' }
  ];

  featuredProjects = [
    {
      title: 'Security Scanner',
      description: 'Automated vulnerability detection tool for web applications',
      tags: ['Python', 'Security', 'Automation']
    },
    {
      title: 'CTF Writeups',
      description: 'Collection of capture the flag challenge solutions',
      tags: ['CTF', 'Writeups', 'Learning']
    },
    {
      title: 'Exploit Development',
      description: 'Research and responsible disclosure of vulnerabilities',
      tags: ['Research', 'CVE', 'Exploits']
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
