import { Cours } from './cours';

export interface Student {
  id?: number;
  nom: string;
  prenom: string;
  dateInscription: Date;
  email: string; // Ajoutez ces propriétés
  telephone: string; // Ajoutez ces propriétés
  genre?: string;
  dateNaissance?: Date;
  adresse?: string;
  courses?: Cours[];
}
