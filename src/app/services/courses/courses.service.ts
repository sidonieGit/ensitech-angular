// src/app/services/courses/courses.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // Importer throwError
import { catchError, map } from 'rxjs/operators';
import { Course } from 'src/app/interfaces/course.model'; // Utiliser notre interface standard

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  // URL de votre course-service. Assurez-vous que le port est le bon.
  private apiUrl = 'http://localhost:8084/api/cours'; // J'ai mis 8082, à adapter.

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les cours depuis le backend.
   * C'est la méthode que votre composant `gestion-students` va appeler.
   * @returns Un Observable qui émettra un tableau de cours.
   */
  getCourses(): Observable<Course[]> {
    // <-- CORRECTION: Nom de méthode et type de retour
    return this.http.get<Course[]>(this.apiUrl).pipe(
      catchError(this.handleError) // Bonne pratique : gérer les erreurs de manière centralisée
    );
  }

  /**
   * Crée un nouveau cours.
   * @param courseData Les données du cours à créer (sans l'ID).
   * @returns Un Observable qui émettra le cours créé (avec son ID).
   */
  createCourse(courseData: Omit<Course, 'id'>): Observable<Course> {
    // Type plus précis
    return this.http
      .post<Course>(this.apiUrl, courseData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Met à jour un cours existant.
   * @param course Le cours complet avec son ID.
   * @returns Un Observable qui émettra le cours mis à jour.
   */
  updateCourse(course: Course): Observable<Course> {
    const url = `${this.apiUrl}/${course.id}`; // L'API REST standard utilise l'ID dans l'URL pour un PUT
    return this.http
      .put<Course>(url, course)
      .pipe(catchError(this.handleError));
  }

  /**
   * Supprime un cours par son ID.
   * @param id L'ID du cours à supprimer.
   * @returns Un Observable<void> pour indiquer que l'opération est terminée.
   */
  deleteCourse(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  /**
   * Gère les erreurs HTTP de manière centralisée pour ce service.
   * @param error L'objet d'erreur HTTP.
   * @returns Un Observable qui émet l'erreur.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue !';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client ou réseau
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Le backend a retourné un code d'erreur
      errorMessage = `Code d'erreur ${error.status}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
