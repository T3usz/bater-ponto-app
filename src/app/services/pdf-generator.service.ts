import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { OfflineStorageService, RegistroPonto } from './offline-storage.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor(private offlineStorage: OfflineStorageService) { }

  async gerarRelatorioMensal(mes: number, ano: number): Promise<Blob> {
    const doc = new jsPDF();
    const registros = this.obterRegistrosMes(mes, ano);

    doc.setFont('helvetica');
    doc.setFontSize(20);
    doc.text('Relatório de Ponto Eletrônico', 20, 20);
    doc.setFontSize(12);
    doc.text(`Período: ${this.getNomeMes(mes)}/${ano}`, 20, 35);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);

    const usuario = this.offlineStorage.obterDadosUsuario() || {
      nome: 'João Silva',
      matricula: '12345',
      cargo: 'Desenvolvedor'
    };

    doc.text(`Funcionário: ${usuario.nome}`, 20, 60);
    doc.text(`Matrícula: ${usuario.matricula}`, 20, 70);
    doc.text(`Cargo: ${usuario.cargo}`, 20, 80);

    doc.line(20, 90, 190, 90);

    let yPosition = 105;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Data', 20, yPosition);
    doc.text('Hora', 50, yPosition);
    doc.text('Tipo', 80, yPosition);
    doc.text('Localização', 120, yPosition);
    doc.line(20, yPosition + 3, 190, yPosition + 3);

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

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${totalPages}`, 170, 290);
      doc.text('Documento gerado automaticamente pelo sistema de ponto eletrônico', 20, 290);
    }

    return doc.output('blob');
  }

  async gerarComprovantePonto(registros: RegistroPonto | RegistroPonto[]): Promise<Blob> {
    const doc = new jsPDF();

    if (Array.isArray(registros)) {
      doc.setFontSize(16);
      doc.text('Comprovante de Ponto do Dia', 20, 20);

      const base = new Date(registros[0].dataHora);
      doc.setFontSize(12);
      doc.text(`Data: ${base.toLocaleDateString('pt-BR')}`, 20, 35);
      doc.text(`Dia da Semana: ${this.getNomeDia(base)}`, 20, 45);
      doc.text(`Horas Trabalhadas: ${this.calcularHorasTrabalhadasDia(registros)}`, 20, 55);

      let y = 70;
      registros.forEach((r, i) => {
        const hora = new Date(r.dataHora).toLocaleTimeString('pt-BR');
        const tipo = this.getTipoTexto(r.tipo);
        const lat = r.localizacao.latitude.toFixed(6);
        const lon = r.localizacao.longitude.toFixed(6);
        const status = r.sincronizado ? 'Sincronizado' : 'Pendente';

        doc.text(`Batida ${i + 1}: ${hora}`, 20, y);
        doc.text(`Tipo: ${tipo} | Status: ${status}`, 20, y + 8);
        doc.text(`Localização: ${lat}, ${lon}`, 20, y + 16);
        y += 28;

        if (y > 250) {
          doc.addPage();
          y = 20;
        }
      });

      doc.setFontSize(10);
      doc.text('Documento gerado automaticamente pelo sistema de ponto eletrônico.', 20, 280);
    } else {
      const registro = registros;
      doc.setFontSize(18);
      doc.text('Comprovante de Registro de Ponto', 20, 20);

      const data = new Date(registro.dataHora);
      doc.setFontSize(12);
      doc.text(`Data: ${data.toLocaleDateString('pt-BR')}`, 20, 45);
      doc.text(`Hora: ${data.toLocaleTimeString('pt-BR')}`, 20, 60);
      doc.text(`Tipo: ${this.getTipoTexto(registro.tipo)}`, 20, 75);

      doc.text('Localização:', 20, 95);
      doc.text(`Latitude: ${registro.localizacao.latitude.toFixed(6)}`, 30, 110);
      doc.text(`Longitude: ${registro.localizacao.longitude.toFixed(6)}`, 30, 125);
      doc.text(`Precisão: ${registro.localizacao.precisao.toFixed(0)}m`, 30, 140);

      doc.text(`Status: ${registro.sincronizado ? 'Sincronizado' : 'Pendente de sincronização'}`, 20, 160);
      doc.setFontSize(10);
      doc.text('Nota: A foto capturada foi armazenada localmente para verificação.', 20, 180);
      doc.text('Por motivos de segurança, a foto não é incluída neste comprovante.', 20, 190);
      doc.text('Este documento foi gerado automaticamente pelo sistema de ponto eletrônico.', 20, 270);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 280);
    }

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

    const horasPorDia = 8;
    const diasTrabalhados = diasUnicos.size;
    const horasTrabalhadas = diasTrabalhados * horasPorDia;

    return {
      diasTrabalhados,
      horasTrabalhadas: `${horasTrabalhadas}h`
    };
  }

  private getNomeDia(data: Date): string {
    const dias = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return dias[data.getDay()];
  }

  private calcularHorasTrabalhadasDia(registros: RegistroPonto[]): string {
    if (registros.length < 2) return '00:00';

    const ordenados = [...registros].sort((a, b) =>
      new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    );

    let total = 0;

    if (ordenados.length === 2) {
      const entrada = new Date(ordenados[0].dataHora);
      const saida = new Date(ordenados[1].dataHora);
      total = Math.round((saida.getTime() - entrada.getTime()) / (1000 * 60));
    } else if (ordenados.length >= 4) {
      const entrada = new Date(ordenados[0].dataHora);
      const saidaAlmoco = new Date(ordenados[1].dataHora);
      const voltaAlmoco = new Date(ordenados[2].dataHora);
      const saida = new Date(ordenados[3].dataHora);

      const manha = Math.round((saidaAlmoco.getTime() - entrada.getTime()) / (1000 * 60));
      const tarde = Math.round((saida.getTime() - voltaAlmoco.getTime()) / (1000 * 60));
      total = manha + tarde;
    }

    const horas = Math.floor(total / 60);
    const minutos = total % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  }

  async baixarPdf(blob: Blob, nomeArquivo: string): Promise<void> {
    const base64Data = await this.converterBlobParaBase64(blob);

    if (Capacitor.getPlatform() === 'web') {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      try {
          await Filesystem.writeFile({
            path: nomeArquivo,
            data: base64Data,
            directory: Directory.External, // ✅ USANDO EXTERNAL
            encoding: Encoding.UTF8,
          });

        alert('Comprovante salvo com sucesso na pasta Documentos.');
      } catch (error) {
        console.error('Erro ao salvar PDF no dispositivo:', error);
        alert('Erro ao salvar o comprovante.');
      }
    }
  }

  private async converterBlobParaBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
