// src/app/interceptors/http-error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr'; // Importer le service Toastr

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {} // Injecter ToastrService

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur inconnue est survenue !';

        if (error.error instanceof ErrorEvent) {
          // Erreur côté client (ex: problème de réseau)
          errorMessage = `Erreur client : ${error.error.message}`;
        } else {
          // Erreur renvoyée par le backend
          // On essaie de récupérer le message métier de notre API
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = `Erreur serveur : ${error.status} - ${error.statusText}`;
          }
        }

        // On affiche la notification d'erreur
        this.toastr.error(errorMessage, 'Erreur !');

        // On propage l'erreur pour que le .subscribe() du composant puisse aussi la traiter si besoin
        return throwError(() => error);
      })
    );
  }
}
