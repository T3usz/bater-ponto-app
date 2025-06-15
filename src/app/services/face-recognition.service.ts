import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {

  constructor() { }

  // Simulação simples de reconhecimento facial
  // Em produção, isso seria substituído por uma solução mais robusta
  async extractFaceDescriptor(imageDataUrl: string): Promise<Float32Array | null> {
    try {
      // Simular processamento de imagem
      await this.delay(1000);
      
      // Gerar um "descritor" simulado baseado na imagem
      const descriptor = new Float32Array(128);
      for (let i = 0; i < 128; i++) {
        descriptor[i] = Math.random();
      }
      
      return descriptor;
    } catch (error) {
      console.error('Erro ao extrair descritor facial:', error);
      return null;
    }
  }

  async compareFaces(descriptor1: Float32Array, descriptor2: Float32Array): Promise<number> {
    // Simular comparação de descritores
    await this.delay(500);
    
    // Calcular uma distância simulada
    let distance = 0;
    for (let i = 0; i < Math.min(descriptor1.length, descriptor2.length); i++) {
      distance += Math.abs(descriptor1[i] - descriptor2[i]);
    }
    
    return distance / Math.min(descriptor1.length, descriptor2.length);
  }

  isMatch(distance: number, threshold: number = 0.5): boolean {
    return distance < threshold;
  }

  saveFaceDescriptor(userId: string, descriptor: Float32Array): void {
    const descriptorArray = Array.from(descriptor);
    localStorage.setItem(`face_descriptor_${userId}`, JSON.stringify(descriptorArray));
  }

  getFaceDescriptor(userId: string): Float32Array | null {
    const stored = localStorage.getItem(`face_descriptor_${userId}`);
    if (stored) {
      const descriptorArray = JSON.parse(stored);
      return new Float32Array(descriptorArray);
    }
    return null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

