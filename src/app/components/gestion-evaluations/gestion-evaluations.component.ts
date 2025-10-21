import { Component, DoCheck, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Course } from 'src/app/interfaces/course.model';
import { Student } from 'src/app/interfaces/students.model';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { EvaluationsService } from 'src/app/services/evaluations/evaluations.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { Evaluation } from '../../interfaces/evaluation.model';
import { SpecialityService } from 'src/app/services/speciality/speciality.service';
// import { SidebarComponent } from '../sidebar/sidebar.component';
// import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-gestion-evaluations',
  templateUrl: './gestion-evaluations.component.html',
  styleUrls: ['./gestion-evaluations.component.css'],
})
// export class GestionEvaluationsComponent implements OnInit {
export class GestionEvaluationsComponent implements DoCheck, OnInit {
  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];
  displayedEvaluations: Evaluation[] = []; // ✅ données visibles (pagination + filtre)

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

  //editingEvaluation: Evaluation | null = null;
  editingEvaluation: any | null = {
    id: 0, // optionnel, ou peut être undefined si généré côté serveur
    code: '',
    dateEvaluation: new Date(),
    description: '',
    grade: 0,
    type: 'CONTROLE_CONTINUE',
    status: 'VALIDEE',
    studentId: 0,
    courseId: 0,
    course: {
      id: 0,
    },
  };
  selectedEvaluation: Evaluation | null = null;
  filterEvaluation: string = '';
  lastStudentId: number | null = null; // Pour suivre le dernier studentId sélectionné
  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private evaluationsService: EvaluationsService,
    private coursesService: CoursesService,
    private specialityService: SpecialityService,

    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadEvaluations();
    this.loadCourses(); // Charger les cours
    this.loadStudents(); // Charger les étudiants
  }
  ngDoCheck() {
    if (
      this.newEvaluation &&
      this.newEvaluation.studentId &&
      this.newEvaluation.studentId !== this.lastStudentId
    ) {
      // console.log('Vérification manuelle :', this.newEvaluation);
      // Met à jour la dernière valeur
      this.lastStudentId = this.newEvaluation.studentId;
      const specialityLabel = this.allStudents.find(
        (s) => s.id === Number(this.newEvaluation.studentId)
      )?.speciality?.label;
      this.loadCoursesBySpeciality(specialityLabel || '');
    }
  }

  loadCoursesBySpeciality(specialityLabel: string) {
    this.loading = true;
    this.specialityService.getSpecialitiesByLabel(specialityLabel).subscribe({
      next: (data) => {
        this.loading = false;
        this.allCourses = data[0].courses || [];
      },
      error: (error) => {
        this.loading = false;
        const errorMsg =
          error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
      },
    });
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
        const errorMsg =
          error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
      },
    });
  }
  loadStudents() {
    this.loading = true;

    // this.studentsService.getStudents().subscribe({
    this.evaluationsService.getEvaluationsStudent().subscribe({
      next: (data) => {
        this.loading = false;
        //console.log('Étudiants chargés:', data);

        this.allStudents = data.filter((s) => s.speciality !== undefined);
      },
      error: (error) => {
        console.error('Erreur chargement des étudiants', error);
        this.loading = false;
        const errorMsg =
          error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
      },
    });
  }

  loadEvaluations(): void {
    this.loading = true;
    // this.evaluationsService.getEvaluations().subscribe({
    this.evaluationsService.loadEvaluationWithStudentAndSpeciality().subscribe({
      next: (data) => {
        // console.log('Évaluations chargées:', data);
        this.loading = false;
        this.evaluations = data;
        this.updateFilteredEvaluations();
        const evaluationIds =
          data
            ?.map((item) => item?.id)
            .filter((id): id is number => typeof id === 'number') || [];

        const highestEvaluationId =
          evaluationIds.length > 0 ? Math.max(...evaluationIds) : 0;
        const nextCodeNumber = highestEvaluationId + 1;
        this.newEvaluation.code = `EVAL-ENS-25-26-${nextCodeNumber
          .toString()
          .padStart(3, '0')}`;
      },
      error: (error) => {
        console.error('Erreur chargement évaluations', error);
        this.loading = false;
        const errorMsg =
          error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
      },
    });
  }

  addEvaluation(): void {
    if (
      this.newEvaluation &&
      this.newEvaluation.studentId &&
      this.newEvaluation.courseId &&
      this.newEvaluation.grade &&
      this.newEvaluation.grade <= 20 &&
      this.newEvaluation.status &&
      this.newEvaluation.type
    ) {
      // Ici, si tu as une API backend, il faut appeler le service pour ajouter et recharger la liste
      this.loading = true;
      this.evaluationsService.createEvaluation(this.newEvaluation).subscribe({
        next: () => {
          this.loading = false;
          this.toastr.success('Évaluation créée', 'Succès !');
          this.resetNewEvaluation();
          this.loadEvaluations();
        },
        error: (error) => {
          this.loading = false;
          const errorMsg =
            error?.error?.message ?? 'Une erreur inattendue est survenue';
          this.toastr.error(errorMsg, 'Erreur !');
        },
      });
    } else {
      this.toastr.error(
        'Veuillez remplir tous les champs correctement.',
        'Erreur !'
      );
    }
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
    // console.log("editingEvaluation", this.editingEvaluation);
    if (
      this.editingEvaluation &&
      this.editingEvaluation.studentId &&
      this.editingEvaluation.course &&
      this.editingEvaluation.grade &&
      this.editingEvaluation.grade <= 20 &&
      this.editingEvaluation.status &&
      this.editingEvaluation.type
    ) {
      this.loading = true;
      this.evaluationsService
        .updateEvaluation(this.editingEvaluation)
        .subscribe({
          next: () => {
            this.loading = false;
            this.toastr.success('Évaluation mise à jour', 'Succès !');
            this.loadEvaluations();
            this.editingEvaluation = null;
          },
          error: (error) => {
            this.loading = false;
            const errorMsg =
              error?.error?.message ?? 'Une erreur inattendue est survenue';
            this.toastr.error(errorMsg, 'Erreur !');
          },
        });
    } else {
      this.toastr.error(
        'Veuillez remplir tous les champs correctement.',
        'Erreur !'
      );
    }
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

  /*updateFilteredEvaluations(): void {
    const filter = this.filterEvaluation.toLowerCase();
    this.filteredEvaluations = this.evaluations.filter(
      (e) =>
        e.description.toLowerCase().includes(filter) ||
        e.code.toLowerCase().includes(filter)
    );
    this.currentPage = 1; // reset sur page 1
    this.updateDisplayedEvaluations();
  }*/
  updateFilteredEvaluations(): void {
    const filter = this.filterEvaluation.toLowerCase().trim();

    if (!filter) {
      this.filteredEvaluations = [...this.evaluations]; // Afficher tout si le filtre est vide
    } else {
      this.filteredEvaluations = this.evaluations.filter((e) => {
        // 1. Recherche par Description ou Code (existante)
        const matchesCodeOrDescription =
          (e.description?.toLowerCase() || '').includes(filter) ||
          (e.code?.toLowerCase() || '').includes(filter);

        // 2. Recherche par Nom de l'étudiant (vérifie si 'student' existe et a un nom/prénom)
        const student = (e as any).student; // Supposons que l'API renvoie le champ 'student'
        const studentName = student
          ? `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase()
          : '';
        const matchesStudent = studentName.includes(filter);

        // 3. Recherche par Cours (vérifie si 'course' existe et a un code/label)
        const course = (e as any).course; // Supposons que l'API renvoie le champ 'course'
        const courseIdentifier = course
          ? `${course.code || ''} ${course.label || ''}`.toLowerCase()
          : '';
        const matchesCourse = courseIdentifier.includes(filter);

        return matchesCodeOrDescription || matchesStudent || matchesCourse;
      });
    }

    this.currentPage = 1; // reset sur page 1
    this.updateDisplayedEvaluations();
  }

  updateDisplayedEvaluations(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedEvaluations = this.filteredEvaluations.slice(start, end);
  }

  get paginatedEvaluations() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEvaluations.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(value: number): void {
    this.itemsPerPage = value;
    this.currentPage = 1;
  }
}
