import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-qr-batida',
  templateUrl: './qr-batida.page.html',
  styleUrls: ['./qr-batida.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QrBatidaPage implements OnInit {

  usuario = {
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    telefone: '(11) 99999-9999',
    matricula: '037245',
    cargo: 'Desenvolvedor',
    departamento: 'TI',
    dataAdmissao: '2023-01-15'
  };

  constructor() { }

  ngOnInit() {
  }

}

