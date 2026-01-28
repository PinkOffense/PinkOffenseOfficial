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

  private fullText = 'Breaking into systems to make them stronger';
  private charIndex = 0;

  skills = [
    { name: 'Penetration Testing', icon: '🔓' },
    { name: 'Red Team Operations', icon: '🎯' },
    { name: 'Web App Security', icon: '🌐' },
    { name: 'Vulnerability Analysis', icon: '🔍' },
    { name: 'AppSec', icon: '🛡️' },
    { name: 'CTF Challenges', icon: '🚩' }
  ];

  featuredProjects = [
    {
      title: 'HackTheBox Writeups',
      description: 'Detailed writeups and walkthroughs from HackTheBox challenges',
      tags: ['HackTheBox', 'Writeups', 'Pentesting']
    },
    {
      title: 'TryHackMe Journey',
      description: 'Progress and notes from the Jr Penetration Tester path',
      tags: ['TryHackMe', 'Learning', 'Pentesting']
    },
    {
      title: 'Vulnerability Research',
      description: 'Security research and vulnerability analysis projects',
      tags: ['Research', 'AppSec', 'Analysis']
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
