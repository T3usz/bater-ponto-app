import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  
  usuario = {
    nome: 'Mateus Lima',
    matricula: '03724',
    cargo: 'Desenvolvedor',
    foto: 'assets/images/user-placeholder.png'
  };

  saldoBancoHoras = {
    credito: 8,
    debito: 2,
    saldo: 6
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navegarPara(rota: string) {
    this.router.navigate([rota]);
  }

}

