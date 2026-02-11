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
    { name: 'CVE', url: 'https://cve.org' },
    { name: 'NVD', url: 'https://nvd.nist.gov' },
    { name: 'Exploit-DB', url: 'https://exploit-db.com' },
    { name: 'VulnHub', url: 'https://vulnhub.com' }
  ];
}
