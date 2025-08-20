// src/app/interceptors/http-error.interceptor.ts
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // Importer le service Toastr
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {} // Injecter ToastrService

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let userFriendlyMessage = 'Une erreur inconnue est survenue.';

        if (error.error instanceof ErrorEvent) {
          // Erreur côté client (réseau, etc.)
          userFriendlyMessage =
            'Erreur de réseau. Veuillez vérifier votre connexion.';
        } else {
          // Erreur renvoyée par le backend (4xx ou 5xx)
          console.error('Erreur du backend reçue:', error);

          // On vérifie si le corps de l'erreur a la structure de notre 'ErrorDetails'
          const errorBody = error.error;
          if (errorBody && typeof errorBody === 'object') {
            if (error.status === 400 && errorBody.details) {
              // Cas spécifique des erreurs de validation (Bad Request)
              // On affiche chaque erreur de validation sur une nouvelle ligne.
              userFriendlyMessage = `Erreurs de validation :\n- ${errorBody.details.join(
                '\n- '
              )}`;
            } else if (errorBody.message) {
              // Cas des autres erreurs gérées (404, 409, 500...)
              userFriendlyMessage = errorBody.message;
            } else {
              // Si le corps de l'erreur est un objet mais n'a pas notre structure attendue
              userFriendlyMessage = `Erreur ${error.status}: ${error.statusText}`;
            }
          } else if (typeof error.error === 'string') {
            // Parfois, le corps de l'erreur est juste une chaîne de caractères
            userFriendlyMessage = error.error;
          }
        }

        // Afficher le toast d'erreur
        this.toastr.error(userFriendlyMessage, 'Opération Échouée', {
          // Options pour afficher les retours à la ligne dans les toasts
          enableHtml: true,
          closeButton: true,
          timeOut: 10000, // Laisser plus de temps pour lire les erreurs de validation
        });

        return throwError(() => error);
      })
    );
  }
}
