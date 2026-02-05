import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { name: 'GitHub', url: 'https://github.com/PinkOffense' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aritaborges' },
    { name: 'TryHackMe', url: 'https://tryhackme.com/p/RitaBorges' },
    { name: 'Keybase', url: 'https://keybase.io/pinkoffense2' }
  ];
}
