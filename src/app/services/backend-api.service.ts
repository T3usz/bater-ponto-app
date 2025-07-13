import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Envia um registro de ponto para o backend.
   */
  async enviarRegistro(registro: any): Promise<void> {
    await firstValueFrom(this.http.post(`${this.baseUrl}/registros`, registro));
  }
}
