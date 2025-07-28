import { Student } from 'src/app/interfaces/students.model';

export const STUDENTS: Student[] = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    address: "12 rue de la Légion d'Honneur",
    telephone: '0612345678',
    birthday: new Date(1990, 8, 5),
    gender: 'MALE',
    matricule: '123456789',
    courses: [
      {
        id: 1,
        title: 'Réseaux et Télécom',
        description:
          'Introduction aux concepts de réseaux et télécommunications.',
      },
      {
        id: 2,
        title: 'Analyse 1',
        duration: '12h30min',
        description: 'Étude des fonctions et des limites en mathématiques.',
      },
      {
        id: 3,
        title: 'Algèbre 1',
        duration: '15h45min',
        description: "Fondements de l'algèbre linéaire et des équations.",
      },
      {
        id: 4,
        title: "Introduction à l'informatique",
        duration: '8h',
        description:
          "Présentation des bases de l'informatique et de la programmation.",
      },
      {
        id: 5,
        title: 'Algorithmique 1',
        duration: '25h30min',
        description:
          'Concepts de base des algorithmes et structures de données.',
      },
    ],
  },
  {
    id: 2,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    address: "12 rue de la Légion d'Honneur",
    telephone: '0612345678',
    birthday: new Date(1990, 8, 5),
    gender: 'MALE',
    matricule: '123456789',
    courses: [
      {
        id: 1,
        title: 'Réseaux et Télécom',
        description:
          'Introduction aux concepts de réseaux et télécommunications.',
      },
      {
        id: 2,
        title: 'Analyse 1',
        duration: '12h30min',
        description: 'Étude des fonctions et des limites en mathématiques.',
      },
      {
        id: 3,
        title: 'Algèbre 1',
        duration: '15h45min',
        description: "Fondements de l'algèbre linéaire et des équations.",
      },
      {
        id: 4,
        title: "Introduction à l'informatique",
        duration: '8h',
        description:
          "Présentation des bases de l'informatique et de la programmation.",
      },
      {
        id: 5,
        title: 'Algorithmique 1',
        duration: '25h30min',
        description:
          'Concepts de base des algorithmes et structures de données.',
      },
    ],
  },
];
