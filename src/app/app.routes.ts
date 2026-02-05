import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./pages/portfolio/portfolio').then(m => m.Portfolio)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.About)
  },
  {
    path: 'writeups',
    loadComponent: () => import('./pages/writeups/writeups').then(m => m.Writeups)
  },
  {
    path: 'guides/burp-suite',
    loadComponent: () => import('./pages/guides/burp-suite/burp-suite').then(m => m.BurpSuite)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
