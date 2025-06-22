import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage {
  constructor(private router: Router) {}

  irParaLogin() {
    this.router.navigateByUrl('/login');
  }
}
