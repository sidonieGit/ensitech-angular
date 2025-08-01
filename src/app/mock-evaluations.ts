import { Evaluation } from './evaluation';

export const EVALUATIONS: Evaluation[] = [
  {
    id: 1,
    code: 'EV202401',
    date: new Date('2024-06-01'),
    note: 15,
    description: 'Évaluation finale du module Réseaux',
    type: 'EXAMEN',
    statut: 'VALIDÉE',
    studentId: 1,
    coursId: 1,
  },
  {
    id: 2,
    code: 'EV202402',
    date: new Date('2024-06-10'),
    note: 18,
    description: 'Projet Analyse 1',
    type: 'TP',
    statut: 'NON VALIDEE',
    studentId: 2,
    coursId: 2,
  },
];
