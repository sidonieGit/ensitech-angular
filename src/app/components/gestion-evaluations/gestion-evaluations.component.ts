import { Component, OnInit } from '@angular/core';
import { Evaluation } from '../../evaluation';
import { EvaluationsService } from 'src/app/services/evaluations/evaluations.service';

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
  };

  editingEvaluation: Evaluation | null = null;
  selectedEvaluation: Evaluation | null = null;
  filterEvaluation: string = '';

  constructor(private evaluationsService: EvaluationsService) {}

  ngOnInit(): void {
    this.loadEvaluations();
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
    this.evaluationsService.addEvaluation(this.newEvaluation).subscribe({
      next: () => {
        this.loadEvaluations();
        this.resetNewEvaluation();
      },
      error: (error) => console.error('Erreur ajout évaluation', error),
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
    };
  }

  editEvaluation(evaluation: Evaluation): void {
    this.editingEvaluation = { ...evaluation };
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
  }

  deleteEvaluation(id?: number): void {
    if (id === undefined) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) {
      this.evaluationsService.deleteEvaluation(id).subscribe({
        next: () => this.loadEvaluations(),
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
