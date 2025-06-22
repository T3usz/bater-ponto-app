import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OfflineStorageService, RegistroPonto } from '../services/offline-storage.service';
import { PdfGeneratorService } from '../services/pdf-generator.service';

@Component({
  selector: 'app-batidas-do-mes',
  templateUrl: './batidas-do-mes.page.html',
  styleUrls: ['./batidas-do-mes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BatidasDoMesPage implements OnInit {

  registros: RegistroPonto[] = [];
  mesAtual: string = '';
  mesNumero: number = 0;
  anoAtual: number = 0;
  carregandoPdf: boolean = false;

  constructor(
    private offlineStorage: OfflineStorageService,
    private pdfGenerator: PdfGeneratorService
  ) { }

  ngOnInit() {
    this.carregarRegistros();
    const agora = new Date();
    this.mesNumero = agora.getMonth() + 1;
    this.anoAtual = agora.getFullYear();
    this.mesAtual = agora.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  carregarRegistros() {
    this.registros = this.offlineStorage.obterRegistrosPonto();
    // Filtrar apenas registros do mês atual
    const agora = new Date();
    this.registros = this.registros.filter(registro => {
      const dataRegistro = new Date(registro.dataHora);
      return dataRegistro.getMonth() === agora.getMonth() && 
             dataRegistro.getFullYear() === agora.getFullYear();
    });
  }

  formatarDataHora(dataHora: string): string {
    return new Date(dataHora).toLocaleString('pt-BR');
  }

  getTipoRegistro(tipo: string): string {
    const tipos: any = {
      'entrada': 'Entrada',
      'saida_almoco': 'Saída Almoço',
      'volta_almoco': 'Volta Almoço',
      'saida': 'Saída'
    };
    return tipos[tipo] || tipo;
  }

  getCorTipo(tipo: string): string {
    const cores: any = {
      'entrada': 'success',
      'saida_almoco': 'warning',
      'volta_almoco': 'warning',
      'saida': 'danger'
    };
    return cores[tipo] || 'medium';
  }

  async gerarPdfMensal() {
    this.carregandoPdf = true;
    
    try {
      const blob = await this.pdfGenerator.gerarRelatorioMensal(this.mesNumero, this.anoAtual);
      const nomeArquivo = `relatorio_ponto_${this.mesNumero}_${this.anoAtual}.pdf`;
      await this.pdfGenerator.baixarPdf(blob, nomeArquivo);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar relatório PDF. Tente novamente.');
    } finally {
      this.carregandoPdf = false;
    }
  }

  async gerarComprovante(registro: RegistroPonto) {
    try {
      const blob = await this.pdfGenerator.gerarComprovantePonto(registro);
      const data = new Date(registro.dataHora);
      const nomeArquivo = `comprovante_ponto_${data.toISOString().split('T')[0]}_${registro.tipo}.pdf`;
      await this.pdfGenerator.baixarPdf(blob, nomeArquivo);
    } catch (error) {
      console.error('Erro ao gerar comprovante:', error);
      alert('Erro ao gerar comprovante. Tente novamente.');
    }
  }

  obterEstatisticas() {
    const total = this.registros.length;
    const sincronizados = this.registros.filter(r => r.sincronizado).length;
    const pendentes = total - sincronizados;
    
    return {
      total,
      sincronizados,
      pendentes
    };
  }

}