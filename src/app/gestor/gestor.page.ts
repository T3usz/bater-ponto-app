import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-gestor',
  templateUrl: './gestor.page.html',
  styleUrls: ['./gestor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GestorPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

