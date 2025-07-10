import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OfflineStorageService } from '../services/offline-storage.service'; // ajuste o caminho se necessário

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  @ViewChild('inputFoto', { static: false }) inputFoto!: ElementRef;

  // Agora os dados vêm do armazenamento centralizado
  usuario: any = {};

  saldoBancoHoras = {
    credito: 8,
    debito: 12,
    minutos: 27,
    saldo: -238 // Calculado automaticamente
  };

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private offlineStorage: OfflineStorageService
  ) {}

  ngOnInit() {
    // Obter dados do usuário centralizados
    this.usuario = this.offlineStorage.obterDadosUsuario() || {};

    // Garantir que a matrícula esteja presente e fixa
    if (!this.usuario.matricula) {
      this.usuario.matricula = '071757';
      this.offlineStorage.salvarDadosUsuario(this.usuario);
    }

    // Calcular saldo automaticamente
    this.calcularSaldoBancoHoras();
  }

  /**
   * Navega para a rota especificada
   * @param rota - Rota de destino
   */
  navegarPara(rota: string) {
    console.log('Navegando para:', rota);
    this.router.navigate([rota]);
  }

  /**
   * Retorna as iniciais do nome do usuário
   * @param nome - Nome completo do usuário
   * @returns Iniciais do nome (ex: "João Silva" -> "JS")
   */
  getInitials(nome: string): string {
    if (!nome) return '';
    return nome
      .split(' ')
      .filter(part => part.length > 0)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  /**
   * Calcula o saldo do banco de horas
   */
  private calcularSaldoBancoHoras() {
    this.saldoBancoHoras.saldo = this.saldoBancoHoras.credito - this.saldoBancoHoras.debito;
  }

  /**
   * Abre o seletor de foto do usuário
   */
  selecionarFoto() {
    if (this.inputFoto) {
      this.inputFoto.nativeElement.click();
    }
  }

  /**
   * Lida com a seleção do arquivo de foto do usuário
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.usuario.foto = reader.result as string;

        // Atualiza o armazenamento com nova foto
        this.offlineStorage.salvarDadosUsuario(this.usuario);
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Formatar horas para exibição
   * @param horas - Número de horas
   * @returns Horas formatadas
   */
  formatarHoras(horas: number): string {
    return Math.abs(horas).toString();
  }

  /**
   * Verificar se o saldo é negativo (débito)
   * @returns true se for débito, false se for crédito
   */
  isDebito(): boolean {
    return this.saldoBancoHoras.saldo < 0;
  }

  /**
   * Obter cor do círculo baseado no saldo
   * @returns Classe CSS para a cor
   */
  getCircleColor(): string {
    return this.isDebito() ? 'danger' : 'success';
  }

  /**
   * Obter texto do status (DÉBITO/CRÉDITO)
   * @returns Status atual do banco de horas
   */
  getStatusText(): string {
    return this.isDebito() ? 'DÉBITO' : 'CRÉDITO';
  }

  /**
   * Abre a tela de notificações
   */
  abrirNotificacoes() {
    this.router.navigate(['/notificacoes']);
  }

  /**
   * Exibe confirmação de logout e redireciona para tela inicial
   */
  async confirmarLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Sair do sistema',
      message: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sair',
          handler: () => {
            localStorage.clear();
            this.router.navigate(['/intro']);
          }
        }
      ]
    });

    await alert.present();
  }
}
