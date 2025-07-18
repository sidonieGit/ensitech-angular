import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { CoursModel } from 'src/app/components/gestion-cours/cours.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private baseUrl = 'http://localhost:8084/api/cours';
  constructor(private http: HttpClient) { }
  getAllCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createCourse(course: CoursModel): Observable<any> {
    return this.http.post(`${this.baseUrl}`, course);
  }
  updateCourse(course: CoursModel): Observable<any> {
    // console.log("ddd", course)
    return this.http.put<CoursModel>(`${this.baseUrl}`, course);
  }
  deleteCourse(id: number): Observable<boolean> {

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(() => {
        console.log(`Course with id ${id} deleted successfully.`);
        return true;
      }),
      catchError((error) => {
        console.error('Error deleting course', error);
        return of(false); // Wrap the value in an observable
      })
    );
  }
}
