import { Injectable } from '@angular/core';

export interface RegistroPonto {
  id: string;
  dataHora: string;
  tipo: 'entrada' | 'saida' | 'saida_almoco' | 'volta_almoco';
  foto: string;
  localizacao: {
    latitude: number;
    longitude: number;
    precisao: number;
  };
  sincronizado: boolean;
  tentativasSincronizacao: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineStorageService {

  private readonly STORAGE_KEYS = {
    REGISTROS_PONTO: 'registros_ponto',
    CONFIGURACOES: 'app_configuracoes',
    USUARIO: 'usuario_dados',
    SINCRONIZACAO: 'sincronizacao_status'
  };

  constructor() {
    this.inicializarArmazenamento();
  }

  private inicializarArmazenamento(): void {
    // Verificar se já existe dados, senão inicializar
    if (!localStorage.getItem(this.STORAGE_KEYS.REGISTROS_PONTO)) {
      localStorage.setItem(this.STORAGE_KEYS.REGISTROS_PONTO, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(this.STORAGE_KEYS.CONFIGURACOES)) {
      const configPadrao = {
        sincronizacaoAutomatica: true,
        intervalSincronizacao: 300000, // 5 minutos
        qualidadeFoto: 90,
        precisaoGPS: 100
      };
      localStorage.setItem(this.STORAGE_KEYS.CONFIGURACOES, JSON.stringify(configPadrao));
    }
  }

  // Métodos para Registros de Ponto
  salvarRegistroPonto(registro: Omit<RegistroPonto, 'id' | 'sincronizado' | 'tentativasSincronizacao'>): string {
    const registros = this.obterRegistrosPonto();
    const novoRegistro: RegistroPonto = {
      ...registro,
      id: this.gerarId(),
      sincronizado: false,
      tentativasSincronizacao: 0
    };
    
    registros.push(novoRegistro);
    localStorage.setItem(this.STORAGE_KEYS.REGISTROS_PONTO, JSON.stringify(registros));
    
    // Tentar sincronizar automaticamente
    this.tentarSincronizacao();
    
    return novoRegistro.id;
  }

  obterRegistrosPonto(): RegistroPonto[] {
    const dados = localStorage.getItem(this.STORAGE_KEYS.REGISTROS_PONTO);
    return dados ? JSON.parse(dados) : [];
  }

  obterRegistrosNaoSincronizados(): RegistroPonto[] {
    return this.obterRegistrosPonto().filter(r => !r.sincronizado);
  }

  marcarComoSincronizado(id: string): void {
    const registros = this.obterRegistrosPonto();
    const index = registros.findIndex(r => r.id === id);
    
    if (index !== -1) {
      registros[index].sincronizado = true;
      localStorage.setItem(this.STORAGE_KEYS.REGISTROS_PONTO, JSON.stringify(registros));
    }
  }

  incrementarTentativaSincronizacao(id: string): void {
    const registros = this.obterRegistrosPonto();
    const index = registros.findIndex(r => r.id === id);
    
    if (index !== -1) {
      registros[index].tentativasSincronizacao++;
      localStorage.setItem(this.STORAGE_KEYS.REGISTROS_PONTO, JSON.stringify(registros));
    }
  }

  // Métodos de Sincronização
  async tentarSincronizacao(): Promise<void> {
    if (!navigator.onLine) {
      console.log('Dispositivo offline. Sincronização adiada.');
      return;
    }

    const registrosNaoSincronizados = this.obterRegistrosNaoSincronizados();
    
    for (const registro of registrosNaoSincronizados) {
      try {
        await this.sincronizarRegistro(registro);
        this.marcarComoSincronizado(registro.id);
        console.log(`Registro ${registro.id} sincronizado com sucesso`);
      } catch (error) {
        console.error(`Erro ao sincronizar registro ${registro.id}:`, error);
        this.incrementarTentativaSincronizacao(registro.id);
        
        // Parar tentativas após 5 falhas
        if (registro.tentativasSincronizacao >= 5) {
          console.warn(`Registro ${registro.id} excedeu limite de tentativas`);
        }
      }
    }
  }

  private async sincronizarRegistro(registro: RegistroPonto): Promise<void> {
    // Simular chamada para API
    // Em produção, substituir por chamada real para o servidor
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular sucesso/falha aleatória para demonstração
        if (Math.random() > 0.2) {
          resolve();
        } else {
          reject(new Error('Falha na sincronização simulada'));
        }
      }, 1000);
    });
  }

  // Métodos de Configuração
  obterConfiguracoes(): any {
    const dados = localStorage.getItem(this.STORAGE_KEYS.CONFIGURACOES);
    return dados ? JSON.parse(dados) : {};
  }

  salvarConfiguracoes(configuracoes: any): void {
    localStorage.setItem(this.STORAGE_KEYS.CONFIGURACOES, JSON.stringify(configuracoes));
  }

  // Métodos de Usuário
  salvarDadosUsuario(usuario: any): void {
    localStorage.setItem(this.STORAGE_KEYS.USUARIO, JSON.stringify(usuario));
  }

  obterDadosUsuario(): any {
    const dados = localStorage.getItem(this.STORAGE_KEYS.USUARIO);
    return dados ? JSON.parse(dados) : null;
  }

  // Métodos Utilitários
  private gerarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  obterEstatisticasSincronizacao(): any {
    const registros = this.obterRegistrosPonto();
    const total = registros.length;
    const sincronizados = registros.filter(r => r.sincronizado).length;
    const pendentes = total - sincronizados;
    
    return {
      total,
      sincronizados,
      pendentes,
      percentualSincronizado: total > 0 ? (sincronizados / total) * 100 : 0
    };
  }

  limparDados(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    this.inicializarArmazenamento();
  }

  exportarDados(): string {
    const dados = {
      registros: this.obterRegistrosPonto(),
      configuracoes: this.obterConfiguracoes(),
      usuario: this.obterDadosUsuario(),
      dataExportacao: new Date().toISOString()
    };
    
    return JSON.stringify(dados, null, 2);
  }

}

