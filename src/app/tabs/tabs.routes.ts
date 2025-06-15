import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'ponto',
        loadComponent: () =>
          import('../ponto/ponto.page').then((m) => m.PontoPage),
      },
      {
        path: 'folha',
        loadComponent: () =>
          import('../folha/folha.page').then((m) => m.FolhaPage),
      },
      {
        path: 'rh',
        loadComponent: () =>
          import('../rh/rh.page').then((m) => m.RhPage),
      },
      {
        path: 'gestor',
        loadComponent: () =>
          import('../gestor/gestor.page').then((m) => m.GestorPage),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
