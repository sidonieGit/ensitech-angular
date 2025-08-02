import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/interfaces/students.model'; // Importez le DTO

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  // L'URL de votre user-service
  private apiUrl = 'http://localhost:8888/api/students';

  constructor(private http: HttpClient) {}

  // GET: Obtenir tous les étudiants
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // GET: Obtenir un étudiant par son ID
  getStudent(id: number): Observable<Student> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Student>(url);
  }

  // POST: Ajouter un étudiant
  // On envoie un objet qui correspond au DTO de création
  addStudent(
    studentData: Omit<Student, 'id' | 'matricule' | 'courses'>
  ): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, studentData);
  }

  // PUT: Mettre à jour un étudiant
  updateStudent(id: number, studentData: Student): Observable<Student> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Student>(url, studentData);
  }

  // DELETE: Supprimer un étudiant
  deleteStudent(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // PUT: Associer des cours à un étudiant
  associateCoursesToStudent(
    studentId: number,
    courseIds: number[]
  ): Observable<Student> {
    const url = `${this.apiUrl}/${studentId}/courses`;
    // Le backend attend une liste d'IDs, pas les objets de cours complets
    return this.http.put<Student>(url, courseIds);
  }
}
