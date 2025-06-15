import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { OfflineStorageService } from '../services/offline-storage.service';
import { FaceRecognitionService } from '../services/face-recognition.service';

@Component({
  selector: 'app-registrar-ponto',
  templateUrl: './registrar-ponto.page.html',
  styleUrls: ['./registrar-ponto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegistrarPontoPage implements OnInit {

  foto: string | undefined;
  localizacao: any;
  gpsAtivo: boolean = false;
  carregando: boolean = false;
  dataHoraAtual: Date = new Date();
  reconhecimentoFacial: boolean = false;
  tipoRegistro: 'entrada' | 'saida' | 'saida_almoco' | 'volta_almoco' = 'entrada';

  constructor(
    private offlineStorage: OfflineStorageService,
    private faceRecognition: FaceRecognitionService
  ) { }

  ngOnInit() {
    this.verificarGPS();
    this.atualizarDataHora();
    this.determinarTipoRegistro();
  }

  private atualizarDataHora() {
    setInterval(() => {
      this.dataHoraAtual = new Date();
    }, 1000);
  }

  private determinarTipoRegistro() {
    const registros = this.offlineStorage.obterRegistrosPonto();
    const hoje = new Date().toDateString();
    const registrosHoje = registros.filter(r => 
      new Date(r.dataHora).toDateString() === hoje
    );

    // Lógica simples para determinar o tipo baseado na quantidade de registros hoje
    switch (registrosHoje.length) {
      case 0:
        this.tipoRegistro = 'entrada';
        break;
      case 1:
        this.tipoRegistro = 'saida_almoco';
        break;
      case 2:
        this.tipoRegistro = 'volta_almoco';
        break;
      default:
        this.tipoRegistro = 'saida';
        break;
    }
  }

  async verificarGPS() {
    try {
      const permissoes = await Geolocation.checkPermissions();
      if (permissoes.location === 'granted') {
        this.gpsAtivo = true;
        await this.obterLocalizacao();
      } else {
        const permissao = await Geolocation.requestPermissions();
        this.gpsAtivo = permissao.location === 'granted';
        if (this.gpsAtivo) {
          await this.obterLocalizacao();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar GPS:', error);
      this.gpsAtivo = false;
    }
  }

  async obterLocalizacao() {
    try {
      const posicao = await Geolocation.getCurrentPosition();
      this.localizacao = {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        precisao: posicao.coords.accuracy
      };
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
  }

  async capturarFoto() {
    try {
      const imagem = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.foto = imagem.dataUrl;
      
      // Verificar reconhecimento facial se disponível
      await this.verificarReconhecimentoFacial();
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
    }
  }

  async verificarReconhecimentoFacial() {
    if (!this.foto) return;

    try {
      const descriptorCadastrado = this.faceRecognition.getFaceDescriptor('user_12345');
      
      if (descriptorCadastrado) {
        const descriptorAtual = await this.faceRecognition.extractFaceDescriptor(this.foto);
        
        if (descriptorAtual) {
          const distancia = await this.faceRecognition.compareFaces(descriptorCadastrado, descriptorAtual);
          this.reconhecimentoFacial = this.faceRecognition.isMatch(distancia);
        }
      }
    } catch (error) {
      console.error('Erro no reconhecimento facial:', error);
      this.reconhecimentoFacial = false;
    }
  }

  async registrarPonto() {
    if (!this.foto) {
      alert('É necessário capturar uma foto para registrar o ponto.');
      return;
    }

    if (!this.gpsAtivo || !this.localizacao) {
      alert('É necessário ativar o GPS para registrar o ponto.');
      return;
    }

    this.carregando = true;

    try {
      const registro = {
        dataHora: new Date().toISOString(),
        tipo: this.tipoRegistro,
        foto: this.foto,
        localizacao: this.localizacao
      };

      // Salvar usando o serviço offline
      const id = this.offlineStorage.salvarRegistroPonto(registro);

      alert(`Ponto registrado com sucesso! ${this.reconhecimentoFacial ? '(Reconhecimento facial confirmado)' : ''}`);
      this.limparFormulario();
      this.determinarTipoRegistro();
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      alert('Erro ao registrar ponto. Tente novamente.');
    } finally {
      this.carregando = false;
    }
  }

  limparFormulario() {
    this.foto = undefined;
    this.reconhecimentoFacial = false;
  }

  getTipoRegistroTexto(): string {
    const tipos = {
      'entrada': 'Entrada',
      'saida_almoco': 'Saída para Almoço',
      'volta_almoco': 'Volta do Almoço',
      'saida': 'Saída'
    };
    return tipos[this.tipoRegistro];
  }

}

