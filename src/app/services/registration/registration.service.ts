import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Registration } from 'src/app/interfaces/registration.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  // private apiUrl = 'http://localhost:8888/api/registrations';
  private apiUrl = 'http://localhost:8888/api/registrations';

  constructor(private http: HttpClient) {}

  getRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.apiUrl);
  }

  getRegistrationById(id: number): Observable<Registration> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Registration>(url);
  }

  addRegistration(
    registration: Omit<Registration, 'id'>
  ): Observable<Registration> {
    return this.http.post<Registration>(this.apiUrl, registration);
  }
}
