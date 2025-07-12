import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login-page');
  }

  const requiredRoles = route.data['role'] as string[];
  const user = authService.getUser();

  if (user && requiredRoles.includes(user.role)) {
    return true;
  }

  return router.parseUrl('/login-page');
};
