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
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then(m => m.Blog)
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./pages/post/post').then(m => m.Post)
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
