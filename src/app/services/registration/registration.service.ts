import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import api_URL from 'src/apiUrl';
import { Registration } from 'src/app/interfaces/registration.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = api_URL + 'registrations';

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

  updateRegistration(registration: Registration): Observable<Registration> {
    const url = `${this.apiUrl}/${registration.id}`;
    return this.http.put<Registration>(url, registration);
  }

  deleteRegistration(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // pdf generation service

  getRegistrationPdf(id: number | undefined): Observable<ArrayBuffer> {
    if (id === undefined) {
      throw new Error('L’ID est requis pour générer le PDF');
    }
    const headers = new HttpHeaders({ Accept: 'application/pdf' });
    return this.http.get(`${this.apiUrl}/${id}/pdf`, {
      headers,
      responseType: 'arraybuffer',
    });
  }

  getOriginPdf(id: number | undefined): Observable<ArrayBuffer> {
    if (id === undefined) {
      throw new Error('L’ID est requis pour générer le PDF');
    }
    const headers = new HttpHeaders({ Accept: 'application/pdf' });
    return this.http.get(`${this.apiUrl}/${id}/original-pdf`, {
      headers,
      responseType: 'arraybuffer',
    });
  }

  /**
   * Récupère la dernière inscription pour un étudiant via son matricule.
   * @param matricule Le matricule de l'étudiant.
   */
  getLatestRegistrationByMatricule(
    matricule: string
  ): Observable<Registration> {
    return this.http.get<Registration>(
      `${this.apiUrl}/by-student/${matricule}/latest`
    );
  }
}
