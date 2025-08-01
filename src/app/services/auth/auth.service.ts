import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated = false;
  private users = [
    { username: 'Patrick', password: 'AE!rkN$ba3y6zoS!', role: 'directeur' },
    { username: 'Sophie', password: '123456', role: 'responsable' },
  ];

  constructor(private router: Router) {}

  /**
   * Authentifie l'utilisateur
   * @param username
   * @param password
   * @returns true si l'utilisateur est authentifié, false sinon
   */
  login(username: string, password: string): boolean {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Enregistrer l'utilisateur authentifié dans le localStorage
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }

    return false;
  }

  // Vérifie si un utilisateur est authentifié
  checkAuthentication() {
    const user = localStorage.getItem('user');
    this.authenticated = !!user;

    if (!this.authenticated) {
      this.router.navigate(['/login-page']);
    }
  }

  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    this.authenticated = !!user;
    return this.authenticated;
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   * @returns L'utilisateur ou null s'il n'est pas connecté
   */
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('user');
  }
}
