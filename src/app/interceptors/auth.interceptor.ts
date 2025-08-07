import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const user = this.authService.getUser();
        const token = user?.token;

        let authReq = req;
        if (token) {
            authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    alert('Session expirée ou non autorisée. Veuillez vous reconnecter.');
                }
                return throwError(() => error);
            })
        );
    }
}
