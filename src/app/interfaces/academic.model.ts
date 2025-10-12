import { Period } from "./period.model";

export interface AcademicYear {
  id?: number ; // L'ID est généré par le frontend
  label: string;
  startDate: Date; // Date de début de l'année académique
  endDate: Date; // Date de fin de l'année académique
  status?: 'EN_COURS' | 'TERMINEE' | 'EN_PREPARATION';// Statut de l'année académique (par exemple, "active", "inactive")
  periods?  :Period[] // periode l'année ac
}
