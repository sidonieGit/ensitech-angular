// Importez les modèles pour Student et Course
import { Course } from './course.model';
import { Student } from './students.model';

export type EvaluationStatus = 'VALIDEE' | 'NON_VALIDEE';
export type EvaluationType = 'CONTROLE_CONTINUE' | 'EXAMEN' | 'TP';

export interface Evaluation {
  id?: number;
  code: string;
  dateEvaluation: Date;
  description: string;
  grade: number;
  type: EvaluationType;
  status: EvaluationStatus;
  studentId: number;
  courseId: number;

  student?: Student; // Objet Student optionnel (peut être null)
  course?: Course; // Objet Course optionnel (peut être null)
}
