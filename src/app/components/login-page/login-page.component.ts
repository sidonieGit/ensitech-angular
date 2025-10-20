import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, LoginRequest } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  email = '';
  password = '';
  errorMessage: string = '';
  errorField: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  onLogin(): void {
    // Réinitialiser les messages d'erreur
    this.errorMessage = '';
    this.errorField = '';
    this.error = ''; // Réinitialiser l'erreur pour chaque tentative

    // Vérification des champs
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer un identifiant.';
      this.errorField = 'email'; //doit correspondre au champ de saisie
      // this.toastr.error(this.errorMessage, 'Email requise');

      return;
    }

    if (!this.password) {
      this.errorMessage = 'Veuillez entrer un mot de passe.';
      this.errorField = 'password';
      // this.toastr.error(this.errorMessage, 'password requise');
      return;
    }

    // Appeler le service d'authentification
    /* if (this.authService.login(this.email, this.password)) {
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
      email: this.email,
      password: this.password,
    };
    this.loading = true;
    this.authService.login(loginData).subscribe({
      next: (res) => {
        let role = res.role;
        let username = "";
        let photo = "";
        let fonction = "";
        if (res.role === 'DIRECTEUR' || res.role === 'SUPER_ADMIN') {
          role = 'directeur';
          username = "Douglas M."
          photo = "assets/images/directeur.jpg"
          fonction = "Directeur"
        } else if (res.role === 'RESPONSABLE_ETUDES' || res.role === 'RESPONSABLE_ETUDE') {
          role = 'responsable';
          username = "Daniel F."
          photo = "assets/images/resp-etude.jpg"
          fonction = "Resp. études"
        }
        res.role = role;
        res.email = res.email; //utilisation de email comme username pour l'affichage
        res.username = username;
        res.photo = photo;
        res.fonction = fonction;

        this.authService.saveConnectedUser(res);
        // console.log('Login success:', res);
        this.loading = false;
        this.toastr.success('Connexion réussie !', 'Succès'); // Message de succès
        if (role === 'directeur') {
          this.router.navigate([`/dashboard`]);
        } else {
          // this.router.navigate([`/courses`]);
          this.router.navigate([`/academic-year`]);
        }
        // redirection ou autre action
      },

      error: (err: HttpErrorResponse) => {
        //console.log('Login error response:', err);
        // Spécifiez le type HttpErrorResponse
        this.loading = false;
        let errorMsg = 'Une erreur inattendue est survenue.';
        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.error?.error) {
          errorMsg = err?.error?.error;
        }
        this.toastr.error(errorMsg, 'Erreur');
        /* let userMessage = 'Une erreur inattendue est survenue.'; // Message par défaut
 
         if (err.status === 0) {
           // Erreur réseau (pas de connexion, serveur inaccessible, problème CORS précoce)
           userMessage =
             'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.';
           this.toastr.error(userMessage, 'Erreur Réseau');
         } else if (err.status >= 400 && err.status < 500) {
           // Erreur client (400 Bad Request, 401 Unauthorized, 403 Forbidden, etc.)
           if (err.error && typeof err.error === 'object') {
             // Si le backend renvoie un objet d'erreur
             if (err.error.error) {
               userMessage = err.error.error; // Message d'erreur spécifique du backend
             } else if (err.error.message) {
               userMessage = err.error.message; // Un autre format de message
             } else if (err.error.errors) {
               // Si c'est une erreur de validation (MethodArgumentNotValidException)
               const fieldErrors = err.error.errors;
               if (fieldErrors.email) {
                 userMessage = fieldErrors.email;
                 this.errorField = 'email';
               } else if (fieldErrors.password) {
                 userMessage = fieldErrors.password;
                 this.errorField = 'password';
               } else {
                 // S'il y a d'autres erreurs de validation non spécifiées
                 userMessage = 'Données de connexion invalides.';
               }
             } else {
               userMessage = 'Identifiant ou mot de passe incorrect.'; // Message générique pour 4xx
             }
           } else if (typeof err.error === 'string') {
             // Si le backend renvoie juste une string
             try {
               const parsedError = JSON.parse(err.error);
               if (parsedError.error) {
                 userMessage = parsedError.error;
               }
             } catch (e) {
               userMessage =
                 err.error || 'Identifiant ou mot de passe incorrect.';
             }
           } else {
             userMessage = 'Identifiant ou mot de passe incorrect.'; // Message générique pour les 4xx non gérés
           }
 
           // Ajustement spécifique pour "Bad credentials" ou "Email incorrect"
           if (
             userMessage.includes('Bad credentials') ||
             userMessage.includes('Mot de passe incorrect') ||
             userMessage.includes('Email incorrect')
           ) {
             userMessage = 'Identifiant ou mot de passe incorrect.';
           }
           this.toastr.error(userMessage, 'Échec de connexion');
         } else if (err.status >= 500) {
           // Erreur serveur (5xx Internal Server Error)
           userMessage =
             'Une erreur interne du serveur est survenue. Veuillez réessayer plus tard.';
           this.toastr.error(userMessage, 'Erreur Serveur');
         } else {
           // Autres erreurs ou cas non prévus
           this.toastr.error(userMessage, 'Erreur');
         }
         //this.errorMessage = userMessage; // Affiche le message aussi sous le formulaire si désiré
         console.error('Login failed:', err); // Conserver le log détaillé pour le débogage*/
      },

    });
  }

  onInputChange(field: string): void {
    if (this.errorField === field || this.errorMessage) {
      this.errorMessage = '';
      this.errorField = '';
      this.error = ''; // Effacer l'erreur générale
    }
  }
}
