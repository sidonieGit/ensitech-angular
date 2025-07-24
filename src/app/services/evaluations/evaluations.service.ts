import { Injectable } from '@angular/core';
import { Evaluation } from '../../evaluation';
import { EVALUATIONS } from '../../mock-evaluations';

@Injectable({
  providedIn: 'root',
})
export class EvaluationsService {
  private readonly STORAGE_KEY = 'evaluations';
  private evaluations: Evaluation[] = [];

  constructor() {
    const savedEvaluations = localStorage.getItem(this.STORAGE_KEY);
    this.evaluations = savedEvaluations ? JSON.parse(savedEvaluations) : EVALUATIONS;
  }

  getEvaluations(): Evaluation[] {
    return this.evaluations;
  }

  addEvaluation(evaluation: Evaluation): void {
    evaluation.id = this.evaluations.length > 0
      ? this.evaluations[this.evaluations.length - 1].id! + 1
      : 1;
    this.evaluations.push({ ...evaluation });
    this.saveToLocalStorage();
  }

  deleteEvaluation(id: number | undefined): void {
    this.evaluations = this.evaluations.filter(e => e.id !== id);
    this.saveToLocalStorage();
  }

  updateEvaluation(updated: Evaluation): void {
    const idx = this.evaluations.findIndex(e => e.id === updated.id);
    if (idx !== -1) {
      this.evaluations[idx] = { ...updated };
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.evaluations));
  }
}
