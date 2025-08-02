// src/app/services/courses/courses.service.ts

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs'; // Importer throwError
import { catchError, map } from 'rxjs/operators';
import { Course } from 'src/app/interfaces/course.model'; // Utiliser notre interface standard

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  // URL de votre course-service. Assurez-vous que le port est le bon.
  private apiUrl = 'http://localhost:8888/course-service/api/courses';

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
  deleteCourse(id: number): Observable<boolean> {
    // Assurez-vous que le type de retour est Observable<boolean>
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      // Si la requête réussit (même avec un corps vide), map la transforme en 'true'
      map(() => {
        console.log(`Course with id ${id} deleted successfully.`);
        return true;
      }),
      // Si la requête échoue, catchError intercepte l'erreur et retourne un Observable de 'false'
      catchError((error) => {
        console.error('Error deleting course', error);
        return of(false); // of() crée un Observable qui émet la valeur 'false'
      })
    );
  }

  /**
   * Inscrit un étudiant à un cours spécifique.
   * @param courseId L'ID du cours.
   * @param studentId L'ID de l'étudiant à inscrire.
   * @returns Un Observable avec le cours mis à jour.
   */
  enrollStudentToCourse(
    courseId: number,
    studentId: number
  ): Observable<Course> {
    const url = `${this.apiUrl}/${courseId}/students/${studentId}`;
    // Le corps de la requête est vide car les IDs sont dans l'URL.
    return this.http.put<Course>(url, {});
  }

  // Vous pourriez aussi ajouter une méthode pour désinscrire
  removeStudentFromCourse(
    courseId: number,
    studentId: number
  ): Observable<Course> {
    const url = `${this.apiUrl}/${courseId}/students/${studentId}`;
    return this.http.delete<Course>(url);
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
