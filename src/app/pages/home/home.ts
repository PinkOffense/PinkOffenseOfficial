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

  private fullText = 'QA by day, pentester in training by night';
  private charIndex = 0;

  skills = [
    { name: 'QA Testing', icon: '🧪' },
    { name: 'Bug Hunting', icon: '🐛' },
    { name: 'Web Security', icon: '🌐' },
    { name: 'CTF Challenges', icon: '🚩' },
    { name: 'Learning Pentesting', icon: '🔓' },
    { name: 'Security Tools', icon: '🛠️' }
  ];

  featuredProjects = [
    {
      title: 'CTF Writeups',
      description: 'My solutions and learnings from capture the flag challenges',
      tags: ['CTF', 'Learning', 'Writeups']
    },
    {
      title: 'Security Notes',
      description: 'Documentation of my security learning journey',
      tags: ['Notes', 'Learning', 'Security']
    },
    {
      title: 'QA & Security',
      description: 'Bridging QA testing with security testing practices',
      tags: ['QA', 'Security', 'Testing']
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
