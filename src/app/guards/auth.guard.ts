import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const autenticado = localStorage.getItem('auth') === 'true';

  if (!autenticado) {
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};
