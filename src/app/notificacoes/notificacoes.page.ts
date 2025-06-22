import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss'],
})
export class NotificacoesPage {
  avisos = [
    { titulo: 'Feliz 2025', mensagem: 'Um ano próspero de muito desenvolvimento pessoal', data: '01/01/2025' },
    { titulo: 'Contestação aceita', mensagem: 'A contestação do relatório de ponto de 12/2024 foi aceita com sucesso!', data: '16/12/2024' },
    { titulo: 'Contestação rejeitada', mensagem: 'A contestação do relatório de ponto de 01/2023 foi rejeitada. Entre em contato com o setor responsável.', data: '08/12/2024' },
    { titulo: 'Inovação', mensagem: 'Inovação é essencial para o sucesso de qualquer negócio.', data: '19/10/2024' },
    { titulo: 'Carteira de Plano de Saúde', mensagem: 'Por favor, venha receber sua nova carteira de plano de saúde.', data: '11/02/2024' },
    { titulo: 'Recibo de férias', mensagem: 'Caro colaborador, por favor, venha assinar seu recibo de férias.', data: '29/01/2024' },
  ];
}
