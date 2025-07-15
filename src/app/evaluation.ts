export interface Evaluation {
  id?: number;
  titre: string;
  description: string;
  date: Date;
  studentId: number; // ID de l'étudiant évalué
  note: number; // Note sur 20
  coursId?: number; // Optionnel, relier à un cours
}
