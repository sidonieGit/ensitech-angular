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
  ) { }

  ngOnInit(): void {
    this.loadEvaluations();
    this.loadCourses(); // Charger les cours
    this.loadStudents(); // Charger les étudiants
  }
  loadCourses() {
    this.loading = true;
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        this.loading = false;
        this.allCourses = data;
      },
      error: (error) => {
        this.loading = false;
        const errorMsg = error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
      },
    });
  }
  loadStudents() {
    this.loading = true;
    this.studentsService.getStudents().subscribe({
      next: (data) => {
        this.loading = false;
        this.allStudents = data;
      },
      error: (error) => {
        console.error('Erreur chargement des étudiants', error)
        this.loading = false;
        const errorMsg = error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
      },
    });
  }

  loadEvaluations(): void {
    this.loading = true;
    this.evaluationsService.getEvaluations().subscribe({
      next: (data) => {
        console.log('Évaluations chargées:', data);
        this.loading = false;
        this.evaluations = data;
        this.updateFilteredEvaluations();
      },
      error: (error) => {
        console.error('Erreur chargement évaluations', error)
        this.loading = false;
        const errorMsg = error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
      },
    });
  }

  addEvaluation(): void {
    // Ici, si tu as une API backend, il faut appeler le service pour ajouter et recharger la liste
    this.loading = true;
    this.evaluationsService.createEvaluation(this.newEvaluation).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Évaluation créée', 'Succès !');
        this.loadEvaluations();
        this.resetNewEvaluation();
      },
      error: (error) => {
        this.loading = false;
        const errorMsg = error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
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
    this.loading = true;
    this.evaluationsService.updateEvaluation(this.editingEvaluation).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Évaluation mise à jour', 'Succès !');
        this.loadEvaluations();
        this.editingEvaluation = null;
      },
      error: (error) => {
        this.loading = false;
        const errorMsg = error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
      },
    });
  }

  viewEvaluation(evaluation: Evaluation): void {
    this.selectedEvaluation = evaluation;
  }

  deleteEvaluation(id: number | undefined): void {
    if (id) {
      this.loading = true;
      this.evaluationsService.deleteEvaluation(id).subscribe((isDeleted) => {
        if (isDeleted) {
          this.loading = false;
          this.toastr.success('Évaluation supprimée', 'Succès !');
          this.loadEvaluations();
        } else {
          this.loading = false;
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
