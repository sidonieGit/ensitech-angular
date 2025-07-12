import { Injectable } from '@angular/core';
import { Cours } from './cours';
import { STUDENTS } from './mock-student'; // Import des données mock

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private localStorageKey = 'students';
  constructor() {
    this.initializeLocalStorage();
  }

  // Initialiser LocalStorage avec les données mock si vide
  private initializeLocalStorage(): void {
    const storedStudents = localStorage.getItem(this.localStorageKey);
    if (!storedStudents) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(STUDENTS));
    }
  }

  // Récupérer la liste combinée des étudiants
  // getStudents(): Student[] {
  //   const storedStudents = JSON.parse(
  //     localStorage.getItem(this.localStorageKey) || '[]'
  //   );
  //   return storedStudents;
  // }

  // Get courses
  getCourses(): Cours[] {
    const storedCourses = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    return storedCourses;
  }

  // Ajouter un nouvel étudiant dans LocalStorage
  // addStudent(student: Student): void {
  //   const students = this.getStudents();
  //   student.id = this.getCurrentId();
  //   students.push(student);
  //   this.saveStudents(students);
  // }

  // private getCurrentId(): number {
  //   const students = this.getStudents();
  //   const maxId = students.reduce(
  //     (max, student) => (student.id && student.id > max ? student.id : max),
  //     0
  //   );
  //   return maxId + 1;
  // }

  // deleteStudent(studentToDelete: Student): void {
  //   const students = this.getStudents();
  //   const updatedStudents = students.filter(
  //     (student) => student.id !== studentToDelete.id
  //   );
  //   this.saveStudents(updatedStudents);
  // }

  // Sauvegarder les données dans LocalStorage
  // private saveStudents(students: Student[]): void {
  //   localStorage.setItem(this.localStorageKey, JSON.stringify(students));
  // }

  // selectStudent(student: Student): void {
  //   this.selectStudent = student;
  // }

  // Sauvegarder les données dans LocalStorage
  // private saveCourses(courses: Cours[]): void {
  //   localStorage.setItem(this.localStorageKey, JSON.stringify(courses));
  // }
}
