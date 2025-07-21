import { Component, OnInit } from '@angular/core';
import { EvaluationsService } from '../../services/evaluations/evaluations.service';
// import { EvaluationsService } from '../../services/evaluations/evaluations.service';
import { Evaluation } from '../../evaluation';
import { Student } from '../../student';
import { COURSES } from '../../mock-cours';
import {STUDENTS } from '../../mock-student'


@Component({
  selector: 'app-gestion-evaluations',
  templateUrl: './gestion-evaluations.component.html',
  styleUrls: ['./gestion-evaluations.component.css'],
})
export class GestionEvaluationsComponent implements OnInit {
  evaluations: Evaluation[] = [];
  students: Student[] = [];
  courses = COURSES;
  newEvaluation: Evaluation = {
    titre: '',
    description: '',
    date: new Date(),
    studentId: 0,
    note: 0,
    coursId: undefined,
  };

  constructor(private evaluationsService: EvaluationsService) {}

  ngOnInit(): void {
    this.evaluations = this.evaluationsService.getEvaluations();
    this.students = STUDENTS;
  }

  addEvaluation(): void {
    if (this.newEvaluation.titre && this.newEvaluation.studentId) {
      this.evaluationsService.addEvaluation({...this.newEvaluation});
      this.evaluations = this.evaluationsService.getEvaluations();
      this.resetForm();
    }
  }

  deleteEvaluation(id: number | undefined): void {
    if (id) {
      this.evaluationsService.deleteEvaluation(id);
      this.evaluations = this.evaluationsService.getEvaluations();
    }
  }

  resetForm(): void {
    this.newEvaluation = {
      titre: '',
      description: '',
      date: new Date(),
      studentId: 0,
      note: 0,
      coursId: undefined,
    };
  }

  getStudentName(id: number): string {
    const student = this.students.find(s => s.id === id);
    return student ? `${student.prenom} ${student.nom}` : 'Non trouvé';
  }

  getCourseTitle(id: number | undefined): string {
    const course = this.courses.find(c => c.id === id);
    return course ? course.title : 'Non trouvé';
  }
}
