import { Injectable } from '@angular/core';
import { Teacher } from 'src/app/interfaces/teachers-interface';
import { TEACHERS } from 'src/app/mock-teachers';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  private readonly STORAGE_KEY = 'teachers';
  private teachers: Teacher[] = [];

  constructor() {
    const savedTeachers = localStorage.getItem(this.STORAGE_KEY);
    this.teachers = savedTeachers ? JSON.parse(savedTeachers) : TEACHERS;
  }

  // Obtenir tous les enseignants
  getTeachers(): Teacher[] {
    return this.teachers;
  }

  // Ajouter un enseignant
  addTeacher(teacher: Teacher): void {
    teacher.id =
      this.teachers.length > 0
        ? this.teachers[this.teachers.length - 1].id! + 1
        : 1; // Génère un ID unique
    teacher.dateDAjout = new Date();
    this.teachers.push(teacher);

    this.saveToLocalStorage();
  }

  // Supprimer un enseignant
  deleteTeacher(id: number | undefined): void {
    this.teachers = this.teachers.filter((teacher) => teacher.id !== id);
    this.saveToLocalStorage();
  }

  // Modifier un enseignant
  updateTeacher(updatedTeacher: Teacher): void {
    const index = this.teachers.findIndex(
      (teacher) => teacher.id === updatedTeacher.id
    );
    if (index !== -1) {
      this.teachers[index] = { ...updatedTeacher };
      this.saveToLocalStorage();
    }
  }

  // Sauvegarder les données dans le Local Storage
  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.teachers));
  }
}
