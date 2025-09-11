import { Component, OnInit } from '@angular/core';
import { Evaluation } from '../../evaluation';
import { EvaluationsService } from 'src/app/services/evaluations/evaluations.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-evaluations',
  templateUrl: './gestion-evaluations.component.html',
  styleUrls: ['./gestion-evaluations.component.css'],
})
export class GestionEvaluationsComponent implements OnInit {
  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];


  newEvaluation: Evaluation = {
    id: 0, // optionnel, ou peut être undefined si généré côté serveur
    code: '',
    date: new Date(),
    description: '',
    note: 0,
    type: 'CONTRÔLE CONTINUE',
    statut: 'VALIDÉE',
    studentId: 0,
    coursId: 0,
  };

  editingEvaluation: Evaluation | null = null;
  selectedEvaluation: Evaluation | null = null;
  filterEvaluation: string = '';

  students: any[] = [];
  courses: any[] = [];

  selectedCourseName: string = '';
  selectedStudentName: string = '';

editingCourseId: number | null = null;
editingStudentId: number | null = null;

  constructor(private evaluationsService: EvaluationsService,
     private studentsService: StudentsService,
     private coursesService: CoursesService,
      private toastr: ToastrService
  ) {}

  ngOnInit(): void {
     this.loadEvaluations();
     this.loadStudents();
     this.loadCourses();
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

  loadStudents(): void {
  this.studentsService.getStudents().subscribe({
    next: (data) => this.students = data,
    error: (error) => console.error('Erreur chargement étudiants', error),
  });
}

loadCourses(): void {
  this.coursesService.getCourses().subscribe({
    next: (data) => this.courses = data,
    error: (error) => console.error('Erreur chargement cours', error),
  });
}

  // addEvaluation(): void {
  //   // Ici, si tu as une API backend, il faut appeler le service pour ajouter et recharger la liste
  //   this.evaluationsService.addEvaluation(this.newEvaluation).subscribe({
  //     next: () => {
  //       this.loadEvaluations();
  //       this.resetNewEvaluation();
  //     },
  //     error: (error) => console.error('Erreur ajout évaluation', error),
  //   });
  // }

  addEvaluation(): void {

    // Vérifier que les IDs sont valides avant d'ajouter
  
  this.evaluationsService.addEvaluation(this.newEvaluation).subscribe({
    next: (createdEvaluation) => {
      this.toastr.success(
        `L'évaluation ${createdEvaluation.code} a été ajoutée avec succès.`,
        'Succès !'
      );
      this.loadEvaluations(); // Recharger la liste après ajout
      this.resetNewEvaluation(); // Réinitialiser le formulaire
    },
    error: (error) =>
      console.error("Erreur lors de l'ajout de l'évaluation", error),
  });
}


  resetNewEvaluation(): void {
    this.newEvaluation = {
      id: 0,
      code: '',
      date: new Date(),
      description: '',
      note: 0,
      type: 'CONTRÔLE CONTINUE',
      statut: 'VALIDÉE',
      studentId: 0,
       coursId: 0,
    };
  }

  editEvaluation(evaluation: Evaluation): void {
    this.editingEvaluation = { ...evaluation };
    // Stocke les IDs pour pré-sélectionner dans le select
    this.editingCourseId = evaluation.coursId;
    this.editingStudentId = evaluation.studentId;
  }

  saveEditEvaluation(): void {
    if (!this.editingEvaluation) return;
    this.evaluationsService.updateEvaluation(this.editingEvaluation).subscribe({
      next: () => {
        this.loadEvaluations();
        this.editingEvaluation = null;
      },
      error: (error) => console.error('Erreur mise à jour évaluation', error),
    });
  }

  viewEvaluation(evaluation: Evaluation): void {
    this.selectedEvaluation = evaluation;

    // Cherche le cours correspondant
  const course = this.courses.find(c => c.id === evaluation.coursId);
  this.selectedCourseName = course ? course.nom : 'Non défini';

  // Cherche l'étudiant correspondant
  const student = this.students.find(s => s.id === evaluation.studentId);
  this.selectedStudentName = student ? `${student.nom} ${student.prenom}` : 'Non défini';

  }

 deleteEvaluation(id: number | undefined): void {
  if (id === undefined) return;

  if (confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) {
    this.evaluationsService.deleteEvaluation(id).subscribe({
      next: () => {
        this.toastr.info("L'évaluation a été supprimée.", 'Information');
        this.loadEvaluations(); // recharge la liste pour mettre à jour l'affichage
      },
      error: (error) => console.error('Erreur lors de la suppression', error),
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
