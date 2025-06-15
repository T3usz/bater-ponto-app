import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FaceRecognitionService } from '../services/face-recognition.service';

@Component({
  selector: 'app-cadastro-rosto',
  templateUrl: './cadastro-rosto.page.html',
  styleUrls: ['./cadastro-rosto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CadastroRostoPage implements OnInit {

  foto: string | undefined;
  carregando: boolean = false;
  rostoDetectado: boolean = false;
  mensagem: string = '';

  constructor(private faceRecognitionService: FaceRecognitionService) { }

  ngOnInit() {
    this.mensagem = 'Pronto para capturar foto facial.';
  }

  async carregarModelos() {
    // Método removido - usando simulação simples
    this.mensagem = 'Sistema de reconhecimento facial ativo.';
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
      await this.analisarRosto();
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      this.mensagem = 'Erro ao capturar foto.';
    }
  }

  async analisarRosto() {
    if (!this.foto) return;

    this.carregando = true;
    this.mensagem = 'Analisando rosto...';

    try {
      const descriptor = await this.faceRecognitionService.extractFaceDescriptor(this.foto);
      
      if (descriptor) {
        this.rostoDetectado = true;
        this.mensagem = 'Rosto detectado com sucesso!';
      } else {
        this.rostoDetectado = false;
        this.mensagem = 'Nenhum rosto detectado. Tente novamente.';
      }
    } catch (error) {
      console.error('Erro na análise:', error);
      this.mensagem = 'Erro na análise do rosto.';
    } finally {
      this.carregando = false;
    }
  }

  async salvarCadastro() {
    if (!this.foto || !this.rostoDetectado) {
      this.mensagem = 'É necessário capturar uma foto com rosto detectado.';
      return;
    }

    this.carregando = true;
    this.mensagem = 'Salvando cadastro...';

    try {
      const descriptor = await this.faceRecognitionService.extractFaceDescriptor(this.foto);
      
      if (descriptor) {
        // Salvar descritor facial do usuário (usando ID fixo para demo)
        this.faceRecognitionService.saveFaceDescriptor('user_12345', descriptor);
        
        // Salvar foto de referência
        localStorage.setItem('user_face_photo', this.foto);
        
        this.mensagem = 'Cadastro facial realizado com sucesso!';
      } else {
        this.mensagem = 'Erro ao processar o rosto. Tente novamente.';
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      this.mensagem = 'Erro ao salvar cadastro.';
    } finally {
      this.carregando = false;
    }
  }

  limparCadastro() {
    this.foto = undefined;
    this.rostoDetectado = false;
    this.mensagem = '';
  }

}

