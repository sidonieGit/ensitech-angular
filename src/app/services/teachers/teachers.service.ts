//src/app/services/teachers.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from 'src/app/interfaces/teachers-interface';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  // L'URL de base de votre API Spring Boot
  private apiUrl = 'http://localhost:8084/api/teachers';

  // 1. Injecter HttpClient
  constructor(private http: HttpClient) {}

  // 2. Réécrire les méthodes

  // GET: Obtenir tous les enseignants
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl);
  }

  // POST: Ajouter un enseignant
  // Notez le type : on envoie un objet sans 'id' ni 'createdAt'. Le backend les génère.
  addTeacher(
    teacherData: Omit<Teacher, 'id' | 'createdAt'>
  ): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, teacherData);
  }

  // DELETE: Supprimer un enseignant par son ID
  deleteTeacher(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // PUT: Modifier un enseignant
  updateTeacher(teacher: Teacher): Observable<Teacher> {
    const url = `${this.apiUrl}/${teacher.id}`;
    return this.http.put<Teacher>(url, teacher);
  }
}
