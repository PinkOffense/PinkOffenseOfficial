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
    { name: 'TryHackMe', url: 'https://tryhackme.com/p/RitaBorges' },
    { name: 'Keybase', url: 'https://keybase.io/pinkoffense2' }
  ];

  resourceLinks = [
    { name: 'MITRE ATT&CK', url: 'https://attack.mitre.org' },
    { name: 'GTFOBins', url: 'https://gtfobins.github.io' },
    { name: 'LOLBAS', url: 'https://lolbas-project.github.io' },
    { name: 'HackerOne', url: 'https://hackerone.com/hacktivity' }
  ];
}
