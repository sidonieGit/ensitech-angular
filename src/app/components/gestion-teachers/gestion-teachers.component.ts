import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/interfaces/teachers-interface';
import { TeachersService } from 'src/app/services/teachers/teachers.service';

@Component({
  selector: 'app-gestion-teachers',
  templateUrl: './gestion-teachers.component.html',
  styleUrls: ['./gestion-teachers.component.css'],
})
export class GestionTeachersComponent implements OnInit {
  filtername: string = '';
  teachers: Teacher[] = [];
  selectedTeacher: Teacher | null = null;
  editingTeacher: Teacher | null = null;
  filteredTeachers: Teacher[] = [];
  newTeacher: Teacher = {
    nom: '',
    prenom: '',
    dateDAjout: new Date(),
    email: '',
  };

  constructor(private teacher: TeachersService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.teachers = this.teacher.getTeachers();
    this.updateFilteredTeachers();
  }

  addTeacher(): void {
    if (this.newTeacher.nom && this.newTeacher.prenom) {
      this.teacher.addTeacher(this.newTeacher);
      this.loadTeachers();
      this.resetForm();
      this.updateFilteredTeachers();
    }
  }

  updateFilteredTeachers(): void {
    this.filteredTeachers = this.teachers.filter(
      (teacher) =>
        teacher.nom.toLowerCase().includes(this.filtername.toLowerCase()) ||
        teacher.prenom.toLowerCase().includes(this.filtername.toLowerCase())
    );
  }

  resetForm(): void {
    this.newTeacher = {
      nom: '',
      prenom: '',
      dateDAjout: new Date(),
      email: '',
    };
  }

  deleteTeacher(id: number | undefined): void {
    this.teacher.deleteTeacher(id);
    this.loadTeachers();
  }

  viewTeacher(teacher: Teacher): void {
    this.selectedTeacher = teacher;
  }

  editTeacher(teacher: Teacher): void {
    this.editingTeacher = { ...teacher };
  }

  saveEditTeacher(): void {
    if (this.editingTeacher) {
      this.teacher.updateTeacher(this.editingTeacher);
      this.loadTeachers();
      this.editingTeacher = null;
    }
  }
}
