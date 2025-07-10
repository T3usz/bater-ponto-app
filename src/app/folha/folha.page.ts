import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OfflineStorageService } from '../services/offline-storage.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-folha',
  templateUrl: './folha.page.html',
  styleUrls: ['./folha.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FolhaPage implements OnInit {

  usuario: any = {};

  constructor(private offlineStorage: OfflineStorageService) {}

  ngOnInit() {
    // Carrega os dados do usuário do armazenamento local
    this.usuario = this.offlineStorage.obterDadosUsuario() || {};
  }

  /**
   * Gera e baixa a folha de pagamento em formato PDF
   */
  baixarFolhaPDF() {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Folha de Pagamento - Maio/2025', 20, 20);
    doc.setFontSize(12);
    doc.text(`Nome: ${this.usuario.nome || '---'}`, 20, 40);
    doc.text(`Matrícula: ${this.usuario.matricula || '---'}`, 20, 50);
    doc.text(`Cargo: ${this.usuario.cargo || '---'}`, 20, 60);
    doc.text('------------------------------------------', 20, 70);
    doc.text('Salário Bruto: R$ 3.200,00', 20, 80);
    doc.text('Descontos: R$ 580,00', 20, 90);
    doc.text('Salário Líquido: R$ 2.620,00', 20, 100);

    doc.save('folha-pagamento-maio-2025.pdf');
  }
}
