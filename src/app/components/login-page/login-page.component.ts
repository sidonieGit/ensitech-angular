import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  username = '';
  password = '';
  errorMessage: string = '';
  errorField: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    // Réinitialiser les messages d'erreur
    this.errorMessage = '';
    this.errorField = '';

    // Vérification des champs
    if (!this.username) {
      this.errorMessage = 'Veuillez entrer un identifiant.';
      this.errorField = 'username';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Veuillez entrer un mot de passe.';
      this.errorField = 'password';
      return;
    }

    // Appeler le service d'authentification
    if (this.authService.login(this.username, this.password)) {
      const role = this.authService.getUser().role;
      if (role === 'directeur') {
        this.router.navigate([`/dashboard`]);
      } else {
        this.router.navigate([`/courses`]);
      }
    } else {
      this.errorMessage = 'Identifiant ou mot de passe incorrect.';
      this.errorField = 'global';
    }
  }

  /**
   * Réinitialise les erreurs pour le champ spécifié
   * @param field - Nom du champ (username ou password)
   */
  onInputChange(field: string): void {
    if (this.errorField === field) {
      this.errorMessage = '';
      this.errorField = '';
    }
  }
}
