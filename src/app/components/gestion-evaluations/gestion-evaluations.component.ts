import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Course } from 'src/app/interfaces/course.model';
import { Student } from 'src/app/interfaces/students.model';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { EvaluationsService } from 'src/app/services/evaluations/evaluations.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { Evaluation } from '../../interfaces/evaluation.model';
// import { SidebarComponent } from '../sidebar/sidebar.component';
// import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-gestion-evaluations',
  templateUrl: './gestion-evaluations.component.html',
  styleUrls: ['./gestion-evaluations.component.css'],
})
export class GestionEvaluationsComponent implements OnInit {
  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];

  // NOUVELLES PROPRIÉTÉS pour les listes déroulantes
  allCourses: Course[] = [];
  allStudents: Student[] = [];

  newEvaluation: Evaluation = {
    id: 0, // optionnel, ou peut être undefined si généré côté serveur
    code: '',
    dateEvaluation: new Date(),
    description: '',
    grade: 0,
    type: 'CONTROLE_CONTINUE',
    status: 'VALIDEE',
    studentId: 0,
    courseId: 0,
  };

  loading: boolean = false;
  errorMsg: string = '';

  editingEvaluation: Evaluation | null = null;
  selectedEvaluation: Evaluation | null = null;
  filterEvaluation: string = '';

  constructor(
    private evaluationsService: EvaluationsService,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadEvaluations();
    this.loadCourses(); // Charger les cours
    this.loadStudents(); // Charger les étudiants
  }
  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        this.allCourses = data;
      },
      error: (error) => console.error('Erreur chargement des cours', error),
    });
  }
  loadStudents() {
    this.studentsService.getStudents().subscribe({
      next: (data) => {
        this.allStudents = data;
      },
      error: (error) => console.error('Erreur chargement des étudiants', error),
    });
  }

  loadEvaluations(): void {
    this.evaluationsService.getEvaluations().subscribe({
      next: (data) => {
        this.evaluations = data;
        this.updateFilteredEvaluations();
      },
      error: (error) => console.error('Erreur chargement évaluations', error),
    });
  }

  addEvaluation(): void {
    // Ici, si tu as une API backend, il faut appeler le service pour ajouter et recharger la liste
    this.evaluationsService.createEvaluation(this.newEvaluation).subscribe({
      next: () => {
        this.toastr.success('Évaluation créée', 'Succès !');
        this.loadEvaluations();
        this.resetNewEvaluation();
      },
      error: (error) => {
        console.error('Erreur ajout évaluation', error);
        this.toastr.error(
          "Erreur lors de l'ajout de l'évaluation.",
          'Erreur !'
        );
      },
    });
  }

  resetNewEvaluation(): void {
    this.newEvaluation = {
      id: 0,
      code: '',
      dateEvaluation: new Date(),
      description: '',
      grade: 0,
      type: 'CONTROLE_CONTINUE',
      status: 'VALIDEE',
      studentId: 0,
      courseId: 0,
    };
  }

  editEvaluation(evaluation: Evaluation): void {
    this.editingEvaluation = { ...evaluation };
  }

  saveEditEvaluation(): void {
    if (!this.editingEvaluation) return;
    this.evaluationsService.updateEvaluation(this.editingEvaluation).subscribe({
      next: () => {
        this.toastr.success('Évaluation mise à jour', 'Succès !');
        this.loadEvaluations();
        this.editingEvaluation = null;
      },
      error: (error) => {
        console.error('Erreur mise à jour évaluation', error);
        this.toastr.error(
          "Erreur lors de la mise à jour de l'évaluation.",
          'Erreur !'
        );
      },
    });
  }

  viewEvaluation(evaluation: Evaluation): void {
    this.selectedEvaluation = evaluation;
  }

  deleteEvaluation(id: number | undefined): void {
    if (id) {
      this.evaluationsService.deleteEvaluation(id).subscribe((isDeleted) => {
        if (isDeleted) {
          this.toastr.success('Évaluation supprimée', 'Succès !');
          this.loadEvaluations();
        } else {
          console.error(`Failed to delete evaluation with id ${id}`);
          this.toastr.error(
            "Erreur lors de la suppression de l'évaluation.",
            'Erreur !'
          );
        }
      });
    }
  }

  updateFilteredEvaluations(): void {
    const filter = this.filterEvaluation.toLowerCase();
    this.filteredEvaluations = this.evaluations.filter(
      (e) =>
        e.description.toLowerCase().includes(filter) ||
        e.code.toLowerCase().includes(filter)
    );
  }
}
