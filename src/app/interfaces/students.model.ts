// Mettez à jour votre interface Student pour qu'elle corresponde au DTO Java

import { Speciality } from './speciality.interface';

export type Gender = 'MALE' | 'FEMALE';

export interface Student {
  id?: number; // Optionnel car non présent à la création
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  telephone?: string;
  // Ajoutez '| null' à la liste des types autorisés.
  birthday?: Date | string | null; // Accepte Date ou string pour la flexibilité
  gender: Gender;
  matricule?: string; // Optionnel et généré par le backend

  //verifie si l'etudiant est inscrit afin de savoir sa specialité
  isEnrolled?: boolean;
  //initialisation de la specialité à non inscrit pour l'affichage et eviter erreur 500
  speciality?: Speciality;

  countryCode?: string;
}
