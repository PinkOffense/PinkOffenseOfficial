import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavSection {
  title: string;
  links: { id: string; icon: string; label: string }[];
}

@Component({
  selector: 'app-burp-suite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './burp-suite.html',
  styleUrl: './burp-suite.scss',
})
export class BurpSuite {
  activeSection = signal('overview');
  navOpen = signal(false);

  navSections: NavSection[] = [
    {
      title: 'Getting Started',
      links: [
        { id: 'overview', icon: '📋', label: 'Overview' },
        { id: 'setup', icon: '⚙️', label: 'Setup & Config' },
      ],
    },
    {
      title: 'Core Tools',
      links: [
        { id: 'proxy', icon: '🔄', label: 'Proxy' },
        { id: 'scanner', icon: '🔍', label: 'Scanner' },
        { id: 'intruder', icon: '⚡', label: 'Intruder' },
        { id: 'repeater', icon: '🔁', label: 'Repeater' },
      ],
    },
    {
      title: 'Advanced Tools',
      links: [
        { id: 'sequencer', icon: '📊', label: 'Sequencer' },
        { id: 'decoder', icon: '🔓', label: 'Decoder' },
        { id: 'comparer', icon: '⚖️', label: 'Comparer' },
        { id: 'organizer', icon: '📁', label: 'Organizer' },
      ],
    },
    {
      title: 'Extensions & API',
      links: [
        { id: 'extensions', icon: '🧩', label: 'BApp Store' },
        { id: 'montoya', icon: '📜', label: 'Montoya API' },
        { id: 'bchecks', icon: '✅', label: 'BChecks' },
      ],
    },
    {
      title: 'Offensive Ops',
      links: [
        { id: 'evasion', icon: '🥷', label: 'Evasion' },
        { id: 'attack-chaining', icon: '⛓️', label: 'Attack Chaining' },
        { id: 'payloads', icon: '💣', label: 'Payload Craft' },
        { id: 'api-hacking', icon: '🔌', label: 'API Hacking' },
        { id: 'session-attacks', icon: '🎫', label: 'Session Attacks' },
        { id: 'redteam', icon: '🎯', label: 'Red Team Ops' },
      ],
    },
  ];

  toggleNav(): void {
    this.navOpen.update(v => !v);
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection.set(id);
      this.navOpen.set(false);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const sections = document.querySelectorAll('.guide-section');
    let current = 'overview';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        current = section.id;
      }
    });
    this.activeSection.set(current);
  }
}
