import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/interfaces/students.model';
import { Evaluation } from '../../evaluation';
import { COURSES } from '../../mock-cours';
import { STUDENTS } from '../../mock-student';
import { EvaluationsService } from '../../services/evaluations/evaluations.service';

@Component({
  selector: 'app-gestion-evaluations',
  templateUrl: './gestion-evaluations.component.html',
  styleUrls: ['./gestion-evaluations.component.css'],
})
export class GestionEvaluationsComponent implements OnInit {
  evaluations: Evaluation[] = [];
  students: Student[] = [];
  courses = COURSES;
  newEvaluation: Evaluation = this.getEmptyEvaluation();
  editingEvaluation: Evaluation | null = null;

  constructor(private evaluationsService: EvaluationsService) {}

  ngOnInit(): void {
    this.evaluations = this.evaluationsService.getEvaluations();
    this.students = STUDENTS;
  }

  getEmptyEvaluation(): Evaluation {
    return {
      code: '',
      date: new Date(),
      note: 0,
      description: '',
      type: 'EXAMEN',
      statut: 'NON VALIDEE',
      studentId: 0,
      coursId: undefined,
    };
  }

  addEvaluation(): void {
    if (this.newEvaluation.code && this.newEvaluation.studentId) {
      this.evaluationsService.addEvaluation({ ...this.newEvaluation });
      this.evaluations = this.evaluationsService.getEvaluations();
      this.newEvaluation = this.getEmptyEvaluation();
    }
  }

  startEdit(evaluation: Evaluation): void {
    // Copie complète pour edition
    this.editingEvaluation = { ...evaluation };
  }

  saveEditEvaluation(): void {
    if (this.editingEvaluation) {
      this.evaluationsService.updateEvaluation(this.editingEvaluation);
      this.evaluations = this.evaluationsService.getEvaluations();
      this.editingEvaluation = null;
    }
  }

  cancelEdit(): void {
    this.editingEvaluation = null;
  }

  deleteEvaluation(id: number | undefined): void {
    if (id) {
      this.evaluationsService.deleteEvaluation(id);
      this.evaluations = this.evaluationsService.getEvaluations();
    }
  }

  getStudentName(id: number): string {
    const student = this.students.find((s) => s.id === id);
    return student ? `${student.firstName} ${student.lastName}` : 'Non trouvé';
  }

  getCourseTitle(id: number | undefined): string {
    const course = this.courses.find((c) => c.id === id);
    return course ? course.title : 'Non trouvé';
  }
}
