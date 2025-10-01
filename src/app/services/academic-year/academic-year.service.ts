import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import api_URL from 'src/apiUrl';
import { AcademicYear } from 'src/app/interfaces/academic.model';

@Injectable({
  providedIn: 'root',
})
export class AcademicYearService {
  private apiUrl = api_URL + 'academic-year';

  http: HttpClient = inject(HttpClient);
  constructor() {}
  // Méthode pour obtenir les années académiques
  getAcademicYears(): Observable<AcademicYear[]> {
    return this.http.get<AcademicYear[]>(this.apiUrl);
  }
  // Méthode pour obtenir une année académique par son ID
  getAcademicYearById(id: number): Observable<AcademicYear> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<AcademicYear>(url);
  }
  // Méthode pour ajouter une nouvelle année académique
  addAcademicYear(
    academicYear: Omit<AcademicYear, 'id'>
  ): Observable<AcademicYear> {
    return this.http.post<AcademicYear>(this.apiUrl, academicYear);
  }
  // Méthode pour supprimer une année académique par son ID
  deleteAcademicYear(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
  // Méthode pour mettre à jour une année académique
  updateAcademicYear(academicYear: AcademicYear): Observable<AcademicYear> {
    const url = `${this.apiUrl}/${academicYear.id}`;
    return this.http.put<AcademicYear>(url, academicYear);
  }

  changeAcademicYearStatus(
    id: number | undefined,
    event: 'START' | 'COMPLETE'
  ): Observable<AcademicYear> {
    const url = `${this.apiUrl}/${id}/status?event=${event}`;
    return this.http.put<AcademicYear>(url, {});
  }
}
