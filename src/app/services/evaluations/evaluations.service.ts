import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { Evaluation } from '../../interfaces/evaluation.model'; // Assurez-vous d'avoir ce modèle
import api_URL from 'src/apiUrl';
import { Student } from 'src/app/interfaces/students.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationsService {
  private apiUrl = api_URL + 'training/evaluations';
  allStudents: Student[] = [];

  constructor(
    private http: HttpClient,
    private studentsService: StudentsService,
    private registrationService: RegistrationService,) { }

  loadStudentWithSpeciality(): Observable<Student[]> {
    return this.studentsService.getStudents().pipe(
      catchError(err => {
        console.error('Erreur lors du chargement des étudiants', err);
        return of([]);
      }),
      switchMap(students => {
        if (students.length === 0) return of([]);

        const registrationRequests = students.map(student => {
          if (!student.matricule) return of(null);
          return this.registrationService.getLatestRegistrationByMatricule(student.matricule!).pipe(
            catchError(() => of(null))
          );
        });


        return forkJoin(registrationRequests).pipe(
          map(registrations => students.map((student, index) => {
            const registration = registrations[index];
            //if (registration && student.matricule) {
            return {
              ...student,
              isEnrolled: !!registration,
              speciality: registration ? { label: registration.specialityLabel, description: '' } : undefined
              // speciality: registration ? registration.specialityLabel : undefined
            };
            //}
          }))
        );
      })
    );
  }
  /* Retourne toutes les évaluations enrichies avec l'étudiant et sa spécialité
  */
  loadEvaluationWithStudentAndSpeciality(): Observable<Evaluation[]> {
    return this.loadStudentWithSpeciality().pipe(
      switchMap(studentsWithRegistration =>
        this.getEvaluations().pipe(
          map(evaluations => evaluations.map(ev => {
            const student = studentsWithRegistration.find(s => s.id === ev.student?.id) || ev.student?.id;
            return {
              ...ev,
              student
            } as Evaluation;
          }))
        )
      )
    );
  }
  getEvaluations(): Observable<Evaluation[]> {
    return this.http
      .get<Evaluation[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getEvaluationsStudent(): Observable<Student[]> {
    return this.loadStudentWithSpeciality()
      .pipe(catchError(this.handleError));
  }



  getEvaluationById(id: number): Observable<Evaluation> {
    return this.http
      .get<Evaluation>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createEvaluation(
    evaluationData: Omit<Evaluation, 'id'>
  ): Observable<Evaluation> {
    return this.http
      .post<Evaluation>(this.apiUrl, evaluationData)
      .pipe(catchError(this.handleError));
  }

  updateEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    // Le backend attend l'objet complet dans le corps du PUT
    return this.http
      .put<Evaluation>(this.apiUrl, evaluation)
      .pipe(catchError(this.handleError));
  }

  deleteEvaluation(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      // Si la requête DELETE réussit, le backend retourne 204 No Content.
      // On utilise `map` pour transformer cette réussite en `true`.
      map(() => true),
      // Si la requête échoue, on intercepte l'erreur et on retourne `false`.
      catchError((error) => {
        console.error('Error deleting evaluation', error);
        return of(false); // of() crée un Observable qui émet `false` puis se termine.
      })
    );
  }

  // -- Méthodes spécifiques --

  getEvaluationsByStudent(studentId: number): Observable<Evaluation[]> {
    return this.http
      .get<Evaluation[]>(`${this.apiUrl}/by-student/${studentId}`)
      .pipe(catchError(this.handleError));
  }

  getEvaluationsByCourse(courseId: number): Observable<Evaluation[]> {
    return this.http
      .get<Evaluation[]>(`${this.apiUrl}/by-course/${courseId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue !';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur ${error.status}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
