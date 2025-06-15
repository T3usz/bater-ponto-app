import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-folha',
  templateUrl: './folha.page.html',
  styleUrls: ['./folha.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FolhaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

