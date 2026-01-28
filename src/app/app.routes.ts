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
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.About)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
