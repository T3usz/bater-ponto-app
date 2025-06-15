import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { OfflineStorageService, RegistroPonto } from './offline-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor(private offlineStorage: OfflineStorageService) { }

  async gerarRelatorioMensal(mes: number, ano: number): Promise<Blob> {
    const doc = new jsPDF();
    const registros = this.obterRegistrosMes(mes, ano);
    
    // Configurar fonte
    doc.setFont('helvetica');
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('Relatório de Ponto Eletrônico', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Período: ${this.getNomeMes(mes)}/${ano}`, 20, 35);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
    
    // Informações do usuário
    const usuario = this.offlineStorage.obterDadosUsuario() || {
      nome: 'João Silva',
      matricula: '12345',
      cargo: 'Desenvolvedor'
    };
    
    doc.text(`Funcionário: ${usuario.nome}`, 20, 60);
    doc.text(`Matrícula: ${usuario.matricula}`, 20, 70);
    doc.text(`Cargo: ${usuario.cargo}`, 20, 80);
    
    // Linha separadora
    doc.line(20, 90, 190, 90);
    
    // Cabeçalho da tabela
    let yPosition = 105;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Data', 20, yPosition);
    doc.text('Hora', 50, yPosition);
    doc.text('Tipo', 80, yPosition);
    doc.text('Localização', 120, yPosition);
    
    // Linha do cabeçalho
    doc.line(20, yPosition + 3, 190, yPosition + 3);
    
    // Dados dos registros
    doc.setFont('helvetica', 'normal');
    yPosition += 15;
    
    registros.forEach((registro, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const data = new Date(registro.dataHora);
      const dataFormatada = data.toLocaleDateString('pt-BR');
      const horaFormatada = data.toLocaleTimeString('pt-BR');
      const tipo = this.getTipoTexto(registro.tipo);
      const localizacao = `${registro.localizacao.latitude.toFixed(6)}, ${registro.localizacao.longitude.toFixed(6)}`;
      
      doc.text(dataFormatada, 20, yPosition);
      doc.text(horaFormatada, 50, yPosition);
      doc.text(tipo, 80, yPosition);
      doc.text(localizacao, 120, yPosition);
      
      yPosition += 10;
    });
    
    // Resumo
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    } else {
      yPosition += 20;
    }
    
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo do Período:', 20, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de registros: ${registros.length}`, 20, yPosition);
    yPosition += 10;
    
    const estatisticas = this.calcularEstatisticas(registros);
    doc.text(`Dias trabalhados: ${estatisticas.diasTrabalhados}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Horas trabalhadas: ${estatisticas.horasTrabalhadas}`, 20, yPosition);
    
    // Rodapé
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${totalPages}`, 170, 290);
      doc.text('Documento gerado automaticamente pelo sistema de ponto eletrônico', 20, 290);
    }
    
    return doc.output('blob');
  }

  async gerarComprovantePonto(registro: RegistroPonto): Promise<Blob> {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.text('Comprovante de Registro de Ponto', 20, 20);
    
    // Informações do registro
    doc.setFontSize(12);
    const data = new Date(registro.dataHora);
    
    doc.text(`Data: ${data.toLocaleDateString('pt-BR')}`, 20, 45);
    doc.text(`Hora: ${data.toLocaleTimeString('pt-BR')}`, 20, 60);
    doc.text(`Tipo: ${this.getTipoTexto(registro.tipo)}`, 20, 75);
    
    // Localização
    doc.text('Localização:', 20, 95);
    doc.text(`Latitude: ${registro.localizacao.latitude.toFixed(6)}`, 30, 110);
    doc.text(`Longitude: ${registro.localizacao.longitude.toFixed(6)}`, 30, 125);
    doc.text(`Precisão: ${registro.localizacao.precisao.toFixed(0)}m`, 30, 140);
    
    // Status de sincronização
    doc.text(`Status: ${registro.sincronizado ? 'Sincronizado' : 'Pendente de sincronização'}`, 20, 160);
    
    // Nota sobre a foto
    doc.setFontSize(10);
    doc.text('Nota: A foto capturada foi armazenada localmente para verificação.', 20, 180);
    doc.text('Por motivos de segurança, a foto não é incluída neste comprovante.', 20, 190);
    
    // Rodapé
    doc.text('Este documento foi gerado automaticamente pelo sistema de ponto eletrônico.', 20, 270);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 280);
    
    return doc.output('blob');
  }

  private obterRegistrosMes(mes: number, ano: number): RegistroPonto[] {
    const registros = this.offlineStorage.obterRegistrosPonto();
    return registros.filter(registro => {
      const data = new Date(registro.dataHora);
      return data.getMonth() === mes - 1 && data.getFullYear() === ano;
    });
  }

  private getTipoTexto(tipo: string): string {
    const tipos: any = {
      'entrada': 'Entrada',
      'saida_almoco': 'Saída Almoço',
      'volta_almoco': 'Volta Almoço',
      'saida': 'Saída'
    };
    return tipos[tipo] || tipo;
  }

  private getNomeMes(mes: number): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[mes - 1];
  }

  private calcularEstatisticas(registros: RegistroPonto[]): any {
    const diasUnicos = new Set();
    registros.forEach(registro => {
      const data = new Date(registro.dataHora);
      diasUnicos.add(data.toDateString());
    });

    // Cálculo simplificado de horas trabalhadas
    const horasPorDia = 8; // Assumindo 8 horas por dia
    const diasTrabalhados = diasUnicos.size;
    const horasTrabalhadas = diasTrabalhados * horasPorDia;

    return {
      diasTrabalhados,
      horasTrabalhadas: `${horasTrabalhadas}h`
    };
  }

  async baixarPdf(blob: Blob, nomeArquivo: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

}

