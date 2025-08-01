export interface Course {
  id?: number; // L'ID est généré par le backend
  title: string;
  coefficient?: number;
  hours?: number;
  teacherId?: number; // Peut être null si non assigné
  // Ajoutez d'autres champs si votre DTO backend en a plus
}
