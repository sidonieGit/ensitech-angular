// Mettez à jour votre interface Student pour qu'elle corresponde au DTO Java

export interface Student {
  id?: number; // Optionnel car non présent à la création
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  telephone?: string;
  // Ajoutez '| null' à la liste des types autorisés.
  birthday?: Date | string | null; // Accepte Date ou string pour la flexibilité
  gender: 'MALE' | 'FEMALE';
  matricule?: string; // Optionnel et généré par le backend
  courses?: any[]; // Nous utiliserons un DTO de cours plus tard
}
