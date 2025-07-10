import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { OfflineStorageService } from '../services/offline-storage.service';
import QRCode from 'qrcode'; // você precisa ter o pacote instalado

@Component({
  selector: 'app-qr-batida',
  templateUrl: './qr-batida.page.html',
  styleUrls: ['./qr-batida.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QrBatidaPage implements OnInit {

  usuario: any = {};
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef;

  constructor(
    private offlineStorage: OfflineStorageService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.usuario = this.offlineStorage.obterDadosUsuario() || {};
    setTimeout(() => {
      this.gerarQRCode();
    }, 300);
  }

  async gerarQRCode() {
    const canvas = this.canvasRef.nativeElement;
    const valorQR = `matricula:${this.usuario.matricula}`;
    await QRCode.toCanvas(canvas, valorQR, { width: 240 });
  }

  async salvarQRCode() {
    const canvas = this.canvasRef.nativeElement;
    const imagem = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = imagem;
    link.download = `qr-${this.usuario.matricula}.png`;
    link.click();

    const toast = await this.toastCtrl.create({
      message: 'QR Code salvo com sucesso!',
      duration: 2000,
      color: 'success'
    });

    toast.present();
  }
}
