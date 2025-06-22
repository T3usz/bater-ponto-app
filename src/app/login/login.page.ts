import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage implements OnInit {
  cpf = '';
  senha = '';
  lembrarCPF = false;
  mostrarSenha = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const cpfSalvo = localStorage.getItem('cpf');
    if (cpfSalvo) {
      this.cpf = cpfSalvo;
      this.lembrarCPF = true;
    }
  }

  fazerLogin() {
    if (this.cpf.trim() === '123.456.789-00' && this.senha === '12345678') {
      localStorage.setItem('auth', 'true');

      if (this.lembrarCPF) {
        localStorage.setItem('cpf', this.cpf);
      } else {
        localStorage.removeItem('cpf');
      }

      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } else {
      alert('CPF ou senha inválidos');
    }
  }

  alternarVisibilidadeSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  formatarCPF(valor: string): string {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
}
