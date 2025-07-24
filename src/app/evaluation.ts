export interface Evaluation {
  id?: number; // identifiant interne
  code: string; // matricule de l'évaluation
  date: Date;
  note: number;
  description: string;
  type: 'CONTRÔLE CONTINUE' | 'EXAMEN' | 'TP';
  statut: 'VALIDÉE' | 'NON VALIDEE';
  studentId: number;
  coursId?: number;
}
