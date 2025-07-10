import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { OfflineStorageService } from '../services/offline-storage.service';

@Component({
  selector: 'app-dados-pessoais',
  templateUrl: './dados-pessoais.page.html',
  styleUrls: ['./dados-pessoais.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DadosPessoaisPage implements OnInit {

  usuario: any = {};

  // Ativa/desativa edição dos campos
  modoEdicao: boolean = false;

  constructor(
    private offlineStorage: OfflineStorageService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // Carrega os dados do usuário do armazenamento local
    this.usuario = this.offlineStorage.obterDadosUsuario() || {};
  }

  /**
   * Salva os dados editados do usuário no armazenamento
   */
  async salvarAlteracoes() {
    this.offlineStorage.salvarDadosUsuario(this.usuario);

    const toast = await this.toastCtrl.create({
      message: 'Dados atualizados com sucesso!',
      duration: 2000,
      color: 'success'
    });

    toast.present();

    // Volta para modo de visualização
    this.modoEdicao = false;
  }
}
