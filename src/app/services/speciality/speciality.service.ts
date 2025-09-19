import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Speciality } from 'src/app/interfaces/speciality.interface';

@Injectable({
  providedIn: 'root',
})
export class SpecialityService {
  private speciality!: Speciality[];

  private apiUrl = 'http://localhost:8888/api/training/specialities';

  // private apiUrl = 'http://ec2-18-234-93-67.compute-1.amazonaws.com:8888/api/speciality';

  http: HttpClient = inject(HttpClient);
  // Méthode pour obtenir les spécialités

  constructor() {}

  getSpecialities(): Observable<Speciality[]> {
    return this.http.get<Speciality[]>(this.apiUrl);
  }

  // Méthode pour obtenir une spécialité par son ID
  getSpecialityById(id: number): Observable<Speciality> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Speciality>(url);
  }

  addSpeciality(speciality: Omit<Speciality, 'id'>): Observable<Speciality> {
    return this.http.post<Speciality>(this.apiUrl, speciality);
  }

  deleteSpeciality(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  updateSpeciality(speciality: Speciality): Observable<Speciality> {
    return this.http.put<Speciality>(this.apiUrl, speciality);
  }
}
