import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { Router } from '@angular/router';
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    role: string;
    email: string;
    token: string;
    username?: string;
}
@Injectable({
    providedIn: 'root'
})
export class AuthService {


    /*private authenticated = false;
    private users = [
      { username: 'Patrick', password: 'AE!rkN$ba3y6zoS!', role: 'directeur' },
      { username: 'Sophie', password: '123456', role: 'responsable' },
    ];*/


    private authenticated = false;
    private baseUrl = 'http://localhost:8888/api/auth';

    constructor(private router: Router, private http: HttpClient) { }


    login(data: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
    }
    saveConnectedUser(user: LoginResponse): void {
        localStorage.setItem('user', JSON.stringify(user));
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