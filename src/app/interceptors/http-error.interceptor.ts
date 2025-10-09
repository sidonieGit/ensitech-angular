// // src/app/interceptors/http-error.interceptor.ts
// import {
//   HttpErrorResponse,
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest,
// } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { ToastrService } from 'ngx-toastr'; // Importer le service Toastr
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable()
// export class HttpErrorInterceptor implements HttpInterceptor {
//   constructor(private toastr: ToastrService) {} // Injecter ToastrService

//   intercept(
//     request: HttpRequest<unknown>,
//     next: HttpHandler
//   ): Observable<HttpEvent<unknown>> {
//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         let userFriendlyMessage = 'Une erreur inconnue est survenue.';

//         if (error.error instanceof ErrorEvent) {
//           // Erreur côté client (réseau, etc.)
//           userFriendlyMessage =
//             'Erreur de réseau. Veuillez vérifier votre connexion.';
//         } else {
//           // Erreur renvoyée par le backend (4xx ou 5xx)
//           console.error('Erreur du backend reçue:', error);

//           // On vérifie si le corps de l'erreur a la structure de notre 'ErrorDetails'
//           const errorBody = error.error;
//           if (errorBody && typeof errorBody === 'object') {
//             if (error.status === 400 && errorBody.details) {
//               // Cas spécifique des erreurs de validation (Bad Request)
//               // On affiche chaque erreur de validation sur une nouvelle ligne.
//               userFriendlyMessage = `Erreurs de validation :\n- ${errorBody.details.join(
//                 '\n- '
//               )}`;
//             } else if (errorBody.message) {
//               // Cas des autres erreurs gérées (404, 409, 500...)
//               userFriendlyMessage = errorBody.message;
//             } else {
//               // Si le corps de l'erreur est un objet mais n'a pas notre structure attendue
//               userFriendlyMessage = `Erreur ${error.status}: ${error.statusText}`;
//             }
//           } else if (typeof error.error === 'string') {
//             // Parfois, le corps de l'erreur est juste une chaîne de caractères
//             userFriendlyMessage = error.error;
//           }
//         }

//         // Afficher le toast d'erreur
//         this.toastr.error(userFriendlyMessage, 'Opération Échouée', {
//           // Options pour afficher les retours à la ligne dans les toasts
//           enableHtml: true,
//           closeButton: true,
//           timeOut: 10000, // Laisser plus de temps pour lire les erreurs de validation
//         });

//         return throwError(() => error);
//       })
//     );
//   }
// }
// error.interceptor.ts (exemple, ton fichier peut être différent)
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur inconnue est survenue!';
        if (error.error instanceof ErrorEvent) {
          // Erreur côté client
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          // Erreur côté serveur
          if (error.status === 400 && error.url?.includes('/api/auth/login')) {
            // C'est l'erreur de login que tu gères déjà dans le composant.
            // Ne fais rien ici ou log seulement.
            // Il est crucial d'éviter d'afficher un toast ici pour cette URL spécifique.
            // La gestion est déléguée au LoginPageComponent.
            console.log(
              'Interceptor: Error 400 for login, letting component handle it.'
            );
            // return throwError(() => error); // Renvoyer l'erreur pour que le composant la gère
          } else {
            // Pour toutes les autres erreurs non spécifiques
            errorMessage = `Erreur ${error.status}: ${error.message || error.statusText
              }`;
            if (error.error && error.error.error) {
              errorMessage = error.error.error; // Si le backend renvoie un champ 'error'
            } else if (error.error && error.error.message) {
              errorMessage = error.error.message; // Si le backend renvoie un champ 'message'
            }

            // Affiche un toast générique UNIQUEMENT si ce n'est pas une erreur de login 400
            // this.toastr.error(errorMessage, 'Erreur HTTP');
            console.log('erreur 500');
          }
        }
        return throwError(() => error); // Important de rejeter l'erreur pour que le composant la reçoive
      })
    );
  }
}