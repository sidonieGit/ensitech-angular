import { Injectable } from '@angular/core';
import { Cours } from 'src/app/cours';
import { COURSES } from 'src/app/mock-cours';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private readonly STORAGE_KEY = 'courses';
  private courses: Cours[] = [];

  constructor() {
    const savedCourses = localStorage.getItem(this.STORAGE_KEY);
    this.courses = savedCourses ? JSON.parse(savedCourses) : COURSES;
  }

  // Obtenir tous les cours
  getCourses(): Cours[] {
    return this.courses;
  }

  // Ajouter un cours
  addCourse(course: Cours): void {
    course.id =
      this.courses.length > 0
        ? this.courses[this.courses.length - 1].id! + 1
        : 1; // Génère un ID unique
    this.courses.push(course);

    this.saveToLocalStorage();
  }

  // Supprimer un cours
  deleteCourse(id: number | undefined): void {
    this.courses = this.courses.filter((course) => course.id !== id);
    this.saveToLocalStorage();
  }

  // Modifier un cours
  updateCourse(updatedCourse: Cours): void {
    const index = this.courses.findIndex(
      (course) => course.id === updatedCourse.id
    );
    if (index !== -1) {
      this.courses[index] = { ...updatedCourse };
      this.saveToLocalStorage();
    }
  }

  // Sauvegarder les données dans le Local Storage
  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.courses));
  }
}
