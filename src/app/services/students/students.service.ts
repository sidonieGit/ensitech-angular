import { Injectable } from '@angular/core';
import { Cours } from 'src/app/cours';
import { STUDENTS } from 'src/app/mock-student';
import { Student } from 'src/app/student';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private readonly STORAGE_KEY = 'students';
  private students: Student[] = [];

  constructor() {
    const savedStudents = localStorage.getItem(this.STORAGE_KEY);
    this.students = savedStudents ? JSON.parse(savedStudents) : STUDENTS;
  }

  // Obtenir tous les étudiants
  getStudents(): Student[] {
    return this.students;
  }

  // Ajouter un étudiant
  addStudent(student: Student): void {
    student.id =
      this.students.length > 0
        ? this.students[this.students.length - 1].id! + 1
        : 1; // Génère un ID unique
    student.dateNaissance = new Date();
    this.students.push(student);

    this.saveToLocalStorage();
  }

  // Supprimer un étudiant
  deleteStudent(id: number | undefined): void {
    this.students = this.students.filter((student) => student.id !== id);
    this.saveToLocalStorage();
  }

  // Modifier un étudiant
  updateStudent(updatedStudent: Student): void {
    const index = this.students.findIndex(
      (student) => student.id === updatedStudent.id
    );
    if (index !== -1) {
      this.students[index] = { ...updatedStudent };
      this.saveToLocalStorage();
    }
  }

  //
  associateCoursesToStudent(studentId: number, courses: Cours[]): void {
    const student = this.students.find((s) => s.id === studentId);
    if (student) {
      student.courses = courses; // Associe les objets Cours
      this.saveToLocalStorage();
    }
  }

  // Sauvegarder les données dans le Local Storage
  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.students));
  }
}
