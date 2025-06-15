import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'registrar-ponto',
    loadComponent: () => import('./registrar-ponto/registrar-ponto.page').then( m => m.RegistrarPontoPage)
  },
  {
    path: 'batidas-do-mes',
    loadComponent: () => import('./batidas-do-mes/batidas-do-mes.page').then( m => m.BatidasDoMesPage)
  },
  {
    path: 'folha-do-mes',
    loadComponent: () => import('./folha-do-mes/folha-do-mes.page').then( m => m.FolhaDoMesPage)
  },
  {
    path: 'qr-batida',
    loadComponent: () => import('./qr-batida/qr-batida.page').then( m => m.QrBatidaPage)
  },
  {
    path: 'dados-pessoais',
    loadComponent: () => import('./dados-pessoais/dados-pessoais.page').then( m => m.DadosPessoaisPage)
  },
  {
    path: 'termos-condicoes',
    loadComponent: () => import('./termos-condicoes/termos-condicoes.page').then( m => m.TermosCondicoesPage)
  },
  {
    path: 'cadastro-rosto',
    loadComponent: () => import('./cadastro-rosto/cadastro-rosto.page').then( m => m.CadastroRostoPage)
  }
];
