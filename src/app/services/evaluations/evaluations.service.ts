import { Injectable } from '@angular/core';
import { Evaluation } from '../../evaluation';
import { EVALUATIONS } from '../../mock-evaluations';
import { Observable, of } from 'rxjs';

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

  getEvaluations(): Observable<Evaluation[]> {
    return of(this.evaluations);
  }

  addEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    evaluation.id = this.evaluations.length > 0
      ? (this.evaluations[this.evaluations.length - 1].id ?? 0) + 1
      : 1;
    this.evaluations.push({ ...evaluation });
    this.saveToLocalStorage();
    return of(evaluation);
  }

  deleteEvaluation(id: number | undefined): Observable<void> {
    if (id === undefined) return of();
    this.evaluations = this.evaluations.filter(e => e.id !== id);
    this.saveToLocalStorage();
    return of();
  }

  updateEvaluation(updated: Evaluation): Observable<Evaluation> {
    const idx = this.evaluations.findIndex(e => e.id === updated.id);
    if (idx !== -1) {
      this.evaluations[idx] = { ...updated };
      this.saveToLocalStorage();
    }
    return of(updated);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.evaluations));
  }
}
