import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ActionSheetController, Platform } from '@ionic/angular';
import { OfflineStorageService, RegistroPonto } from '../services/offline-storage.service';
import { PdfGeneratorService } from '../services/pdf-generator.service';

interface RegistroDia {
  data: string;
  horasTrabalhadas: string;
  batidas: { hora: string }[];
  registrosOriginais: RegistroPonto[];
}

@Component({
  selector: 'app-batidas-do-mes',
  templateUrl: './batidas-do-mes.page.html',
  styleUrls: ['./batidas-do-mes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BatidasDoMesPage implements OnInit {

  registros: RegistroPonto[] = [];
  registrosFiltrados: RegistroDia[] = [];
  mesSelecionado: string = '';

  saldoBancoHoras = {
    credito: 8,
    debito: 12,
    minutos: 27,
    saldo: -238
  };

  constructor(
    private offlineStorage: OfflineStorageService,
    private pdfGenerator: PdfGeneratorService,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.inicializarMesAtual();
    this.carregarRegistros();
    this.calcularSaldoBancoHoras();
  }

  inicializarMesAtual() {
    const agora = new Date();
    const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
    const ano = agora.getFullYear();
    this.mesSelecionado = `${mes}-${ano}`;
  }

  carregarRegistros() {
    this.registros = this.offlineStorage.obterRegistrosPonto();
    this.filtrarPorMes();
  }

  filtrarPorMes() {
    if (!this.mesSelecionado) return;

    const [mes, ano] = this.mesSelecionado.split('-');
    const mesNum = parseInt(mes) - 1;
    const anoNum = parseInt(ano);

    const registrosFiltrados = this.registros.filter(registro => {
      const dataRegistro = new Date(registro.dataHora);
      return dataRegistro.getMonth() === mesNum && 
             dataRegistro.getFullYear() === anoNum;
    });

    this.registrosFiltrados = this.agruparPorDia(registrosFiltrados);
  }

  agruparPorDia(registros: RegistroPonto[]): RegistroDia[] {
    const diasMap = new Map<string, RegistroPonto[]>();

    registros.forEach(registro => {
      const data = new Date(registro.dataHora).toDateString();
      if (!diasMap.has(data)) diasMap.set(data, []);
      diasMap.get(data)!.push(registro);
    });

    const diasArray: RegistroDia[] = [];
    diasMap.forEach((registrosDia, dataString) => {
      const data = new Date(dataString);
      diasArray.push({
        data: data.toISOString().split('T')[0],
        horasTrabalhadas: this.calcularHorasTrabalhadas(registrosDia),
        batidas: this.organizarBatidas(registrosDia),
        registrosOriginais: registrosDia
      });
    });

    return diasArray.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  organizarBatidas(registros: RegistroPonto[]): { hora: string }[] {
    const registrosOrdenados = registros.sort((a, b) =>
      new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    );

    const batidas = [
      { hora: '--:--' },
      { hora: '--:--' },
      { hora: '--:--' },
      { hora: '--:--' }
    ];

    registrosOrdenados.forEach((registro, index) => {
      if (index < 4) {
        const data = new Date(registro.dataHora);
        batidas[index].hora = data.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    });

    return batidas;
  }

  calcularHorasTrabalhadas(registros: RegistroPonto[]): string {
    if (registros.length < 2) return '00:00';

    const registrosOrdenados = registros.sort((a, b) =>
      new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    );

    let totalMinutos = 0;

    if (registrosOrdenados.length === 2) {
      const entrada = new Date(registrosOrdenados[0].dataHora);
      const saida = new Date(registrosOrdenados[1].dataHora);
      totalMinutos = Math.round((saida.getTime() - entrada.getTime()) / (1000 * 60));
    } else if (registrosOrdenados.length >= 4) {
      const entrada = new Date(registrosOrdenados[0].dataHora);
      const saidaAlmoco = new Date(registrosOrdenados[1].dataHora);
      const voltaAlmoco = new Date(registrosOrdenados[2].dataHora);
      const saida = new Date(registrosOrdenados[3].dataHora);

      const manha = Math.round((saidaAlmoco.getTime() - entrada.getTime()) / (1000 * 60));
      const tarde = Math.round((saida.getTime() - voltaAlmoco.getTime()) / (1000 * 60));
      totalMinutos = manha + tarde;
    }

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  }

  formatarData(data: string): string {
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatarDiaSemana(data: string): string {
    const date = new Date(data + 'T00:00:00');
    const diasSemana = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return diasSemana[date.getDay()];
  }

  formatarHorasTrabalhadas(horas: string): string {
    return horas;
  }

  formatarSaldoBancoHoras(): string {
    const saldoAbsoluto = Math.abs(this.saldoBancoHoras.saldo);
    const horas = Math.floor(saldoAbsoluto / 60);
    const minutos = saldoAbsoluto % 60;
    const sinal = this.saldoBancoHoras.saldo < 0 ? 'D' : 'C';
    return `${horas.toString().padStart(3, '0')}:${minutos.toString().padStart(2, '0')}${sinal}`;
  }

  calcularSaldoBancoHoras() {
    this.saldoBancoHoras.saldo = this.saldoBancoHoras.credito - this.saldoBancoHoras.debito;
  }

  async abrirOpcoesComprovante(registro: RegistroDia) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Comprovante',
      buttons: [
        {
          text: 'Gerar e Salvar PDF',
          icon: 'document-text-outline',
          handler: () => this.gerarComprovante(registro)
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async gerarComprovante(registro: RegistroDia) {
    try {
      if (registro.registrosOriginais.length === 0) {
        alert('Nenhum dado disponível para gerar o comprovante.');
        return;
      }

      const blob = await this.pdfGenerator.gerarComprovantePonto(registro.registrosOriginais);
      const nomeArquivo = `comprovante_${registro.data}.pdf`;
      await this.pdfGenerator.baixarPdf(blob, nomeArquivo);

    } catch (error) {
      console.error('Erro ao gerar comprovante:', error);
      alert('Erro ao gerar comprovante. Tente novamente.');
    }
  }
}
