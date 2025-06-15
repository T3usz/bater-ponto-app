import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ponto',
  templateUrl: './ponto.page.html',
  styleUrls: ['./ponto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PontoPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  registrarPonto() {
    this.router.navigate(['/registrar-ponto']);
  }

  verBatidas() {
    this.router.navigate(['/batidas-do-mes']);
  }

}

