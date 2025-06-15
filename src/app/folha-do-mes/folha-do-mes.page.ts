import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-folha-do-mes',
  templateUrl: './folha-do-mes.page.html',
  styleUrls: ['./folha-do-mes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FolhaDoMesPage implements OnInit {

  folha = {
    mes: 'Janeiro 2024',
    salarioBase: 5000.00,
    horasExtras: 150.00,
    descontos: 800.00,
    salarioLiquido: 4350.00
  };

  constructor() { }

  ngOnInit() {
  }

}

