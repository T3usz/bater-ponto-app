import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'intro',
    pathMatch: 'full'
  },
  {
    path: 'intro',
    loadComponent: () => import('./intro/intro.page').then(m => m.IntroPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registrar-ponto',
    loadComponent: () => import('./registrar-ponto/registrar-ponto.page').then(m => m.RegistrarPontoPage),
    canActivate: [authGuard]
  },
  {
    path: 'batidas-do-mes',
    loadComponent: () => import('./batidas-do-mes/batidas-do-mes.page').then(m => m.BatidasDoMesPage),
    canActivate: [authGuard]
  },
  {
    path: 'folha-do-mes',
    loadComponent: () => import('./folha-do-mes/folha-do-mes.page').then(m => m.FolhaDoMesPage),
    canActivate: [authGuard]
  },
  {
    path: 'qr-batida',
    loadComponent: () => import('./qr-batida/qr-batida.page').then(m => m.QrBatidaPage),
    canActivate: [authGuard]
  },
  {
    path: 'dados-pessoais',
    loadComponent: () => import('./dados-pessoais/dados-pessoais.page').then(m => m.DadosPessoaisPage),
    canActivate: [authGuard]
  },
  {
    path: 'termos-condicoes',
    loadComponent: () => import('./termos-condicoes/termos-condicoes.page').then(m => m.TermosCondicoesPage),
    canActivate: [authGuard]
  },
  {
    path: 'cadastro-rosto',
    loadComponent: () => import('./cadastro-rosto/cadastro-rosto.page').then(m => m.CadastroRostoPage),
    canActivate: [authGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
    canActivate: [authGuard]
  },
  {
  path: 'notificacoes',
  loadComponent: () => import('./notificacoes/notificacoes.page').then(m => m.NotificacoesPage),
  canActivate: [authGuard]
}
];
