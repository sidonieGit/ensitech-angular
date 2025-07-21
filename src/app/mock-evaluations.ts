import { Evaluation } from './evaluation';

export const EVALUATIONS: Evaluation[] = [
  {
    id: 1,
    titre: 'Examen Réseaux',
    description: 'Évaluation finale du module Réseaux',
    date: new Date('2024-06-01'),
    studentId: 1,
    note: 15,
    coursId: 1,
  },
  {
    id: 2,
    titre: 'Projet Analyse 1',
    description: 'Projet semestriel Analyse 1',
    date: new Date('2024-06-10'),
    studentId: 2,
    note: 18,
    coursId: 2,
  },
];
