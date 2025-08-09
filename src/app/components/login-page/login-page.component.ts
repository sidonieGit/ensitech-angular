import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from 'src/app/services/auth/auth.service';

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
  error: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

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
    /* if (this.authService.login(this.username, this.password)) {
       const role = this.authService.getUser().role;
       if (role === 'directeur') {
         this.router.navigate([`/dashboard`]);
       } else {
         this.router.navigate([`/courses`]);
       }
     } else {
       this.errorMessage = 'Identifiant ou mot de passe incorrect.';
       this.errorField = 'global';
     }*/
    const loginData: LoginRequest = {
      email: this.username,
      password: this.password
    };
    this.loading = true;
    this.authService.login(loginData).subscribe({
      next: (res) => {
        let role = res.role;
        if (res.role === 'DIRECTEUR' || res.role === 'SUPER_ADMIN') {
          role = "directeur"
        } else if (res.role === 'RESPONSABLE_ETUDES') {
          role = "responsable"
        }
        res.role = role;
        res.username = res.email;

        this.authService.saveConnectedUser(res);
        console.log('Login success:', res);
        this.loading = false;
        if (role === 'directeur') {
          this.router.navigate([`/dashboard`]);
        } else {
          this.router.navigate([`/courses`]);
        }
        // redirection ou autre action
      },
      error: (err) => {
        console.error('Login failedss:', err);
        // console.error('Login failed:', err?.error?.errors?.email);
        this.errorMessage = err?.error?.error || err?.error?.errors?.email || 'Echec de connexion.';
        this.error =
          err?.error?.errors?.email ||
          err?.error?.errors?.password ||
          err?.error?.error ||
          'Echec de connexion.';
        if (this.error.includes('Bad credentials')) {
          this.error = 'Identifiant ou mot de passe incorrect.';
        }
        this.loading = false;
      }
    });

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
