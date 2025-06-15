import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-rh',
  templateUrl: './rh.page.html',
  styleUrls: ['./rh.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RhPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

