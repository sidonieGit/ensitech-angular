import { Component, OnInit } from '@angular/core';
import { Cours } from 'src/app/cours';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { Student } from '../../student';

@Component({
  selector: 'app-gestion-students',
  templateUrl: './gestion-students.component.html',
  styleUrls: ['./gestion-students.component.css'],
})
export class GestionStudentsComponent implements OnInit {
  filtername: string = '';
  students: Student[] = [];
  selectedStudent: Student | null = null;
  filteredStudents: Student[] = [];
  editingStudent: Student | null = null;

  newStudent: Student = {
    nom: '',
    prenom: '',
    telephone: '',
    dateInscription: new Date(),
    email: '',
  };
  allCourses: Cours[] = [];

  constructor(
    private student: StudentsService,
    private courseService: CoursesService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }

  loadStudents(): void {
    this.students = this.student.getStudents();
    this.updateFilteredStudents();
  }

  loadCourses(): void {
    this.allCourses = this.courseService.getCourses();
  }

  openAssociateCoursesModal(student: Student): void {
    this.selectedStudent = student;
    const selectedCourseIds = student.courses?.map((course) => course.id) || [];
    this.allCourses = this.allCourses.map((course) => ({
      ...course,
      selected: selectedCourseIds.includes(course.id!),
    }));
  }

  getCourseTitles(courses: Cours[] | undefined): string {
    return (
      courses?.map((course) => course.title).join(', ') || 'Aucun cours associé'
    );
  }

  associateCourses(): void {
    if (this.selectedStudent) {
      const selectedCourses = this.allCourses.filter(
        (course) => course.selected
      );
      this.student.associateCoursesToStudent(
        this.selectedStudent.id!,
        selectedCourses
      );
      this.loadStudents();
    }
  }

  updateFilteredStudents(): void {
    this.filteredStudents = this.students.filter(
      (student) =>
        student.nom.toLowerCase().includes(this.filtername.toLowerCase()) ||
        student.prenom.toLowerCase().includes(this.filtername.toLowerCase())
    );
  }

  addStudent(): void {
    if (this.newStudent.nom && this.newStudent.prenom) {
      this.student.addStudent(this.newStudent);
      this.loadStudents();
      this.resetForm();
      this.updateFilteredStudents();
    }
  }

  resetForm(): void {
    this.newStudent = {
      nom: '',
      prenom: '',
      telephone: '',
      dateInscription: new Date(),
      email: '',
    };
  }

  deleteStudent(id: number | undefined): void {
    this.student.deleteStudent(id);
    this.loadStudents();
  }

  viewStudent(student: Student): void {
    this.selectedStudent = student;
  }

  editStudent(student: Student): void {
    this.editingStudent = { ...student };
  }

  saveEditStudent(): void {
    if (this.editingStudent) {
      this.student.updateStudent(this.editingStudent);
      this.loadStudents();
      this.editingStudent = null;
    }
  }
}
