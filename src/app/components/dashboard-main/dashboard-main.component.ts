import { Speciality } from 'src/app/interfaces/speciality.interface';
import { EvaluationsService } from './../../services/evaluations/evaluations.service';
import { SpecialityService } from './../../services/speciality/speciality.service';
import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { TeachersService } from 'src/app/services/teachers/teachers.service';
import { Evaluation } from 'src/app/interfaces/evaluation.model';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css'],
})
export class DashboardMainComponent implements OnInit {
  // Variables pour afficher les totaux dans le template HTML
  totalStudents: number = 0;
  totalCourses: number = 0;
  totalTeachers: number = 0;
  totalSpecialities: number = 0;
  totalRegistrations: number = 0;
  totalEvaluations: number = 0;
  listSpecialities: Speciality[] = [];
  listEvaluations: Evaluation[] = [];

  // Données pour le graphique, initialisées avec des zéros.
  // Elles seront mises à jour lorsque les données de l'API arriveront.
  public barChartData = {
    labels: [
      'Enseignants',
      'Etudiants',
      'Inscriptions',
      'Spécialités',
      'Cours',
      'Evaluations',
    ],
    datasets: [
      {
        label: 'Statistiques',
        data: [0, 0, 0, 0, 0, 0], // On commence à 0
        backgroundColor: ['#006699', '#f1bb35', '#f20444', '#0003ff', '#38a3a5', '#6a4c93'],
        borderColor: ['#f3f4f6', '#f3f4f6', '#f3f4f6', '#f3f4f6', '#f3f4f6', '#f3f4f6'],
        borderWidth: 1,
        hoverBackgroundColor: ['#444a58', '#444a58', '#444a58', '#444a58', '#444a58', '#444a58'],
      },
    ],
  };

  // Options du graphique (vous pouvez les décommenter si vous utilisez une librairie comme Chart.js)
  public barChartOptions = {
    responsive: true,
    scales: {
      y: {
        // Note: la syntaxe a peut-être changé selon votre version de Chart.js
        beginAtZero: true,
      },
    },
  };

  constructor(
    private studentService: StudentsService,
    private teachersService: TeachersService, // Correction du nom de la variable
    private coursesService: CoursesService,
    private specialityService: SpecialityService,
    private registrationService: RegistrationService,
    private EvaluationsService: EvaluationsService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Méthode pour charger toutes les données nécessaires au tableau de bord.
   */
  loadDashboardData(): void {
    // --- Chargement des données des enseignants ---
    this.teachersService.getTeachers().subscribe({
      next: (teachers) => {
        // Ce code s'exécute quand l'appel API réussit
        this.totalTeachers = teachers.length;

        // Mettre à jour les données du graphique
        const newData = [...this.barChartData.datasets[0].data];
        newData[0] = this.totalTeachers;
        this.barChartData.datasets[0].data = newData;


      },
      error: (error) => {
        // Ce code s'exécute en cas d'erreur
        console.error(
          "Erreur lors de la récupération du nombre d'enseignants",
          error
        );
        this.totalTeachers = 0;
      },
    });

    // --- Chargement des données des étudiants (gardé commenté comme demandé) ---
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.totalStudents = students.length;

        // Mettre à jour les données du graphique
        const newData = [...this.barChartData.datasets[0].data];
        newData[1] = this.totalStudents;
        this.barChartData.datasets[0].data = newData;


      },
      error: (error) => {
        console.error(
          "Erreur lors de la récupération du nombre d'étudiants",
          error
        );
        this.totalStudents = 0;
      },
    });

    // --- Chargement des données des cours (gardé commenté comme demandé) ---
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.totalCourses = courses.length;

        // Mettre à jour les données du graphique
        const newData = [...this.barChartData.datasets[0].data];
        newData[4] = this.totalCourses;
        this.barChartData.datasets[0].data = newData;

      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération du nombre de cours',
          error
        );
        this.totalCourses = 0;
      },
    });

    // --- Chargement des données des spécialités ---
    this.specialityService.getSpecialities().subscribe({
      next: (specialities) => {
        this.listSpecialities = specialities;
        const newData = [...this.barChartData.datasets[0].data];
        newData[3] = specialities.length;
        this.barChartData.datasets[0].data = newData;
        this.totalSpecialities = specialities.length;
        // console.log('Specialities loaded:', this.listSpecialities);

      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération du nombre de spécialités',
          error
        );
        this.totalSpecialities = 0;
      },
    });

    // --- Chargement des données des inscriptions ---
    this.registrationService.getRegistrations().subscribe({
      next: (registrations) => {
        const newData = [...this.barChartData.datasets[0].data];
        newData[2] = registrations.length;
        this.barChartData.datasets[0].data = newData;
        this.totalRegistrations = registrations.length;
      },
      error: (error) => {
        console.error(
          "Erreur lors de la récupération du nombre d'inscriptions",
          error
        );
        this.totalRegistrations = 0;
      },
    });

    // --- Chargement des données des évaluations ---
    this.EvaluationsService.getEvaluations().subscribe({
      next: (evaluations) => {
        this.listEvaluations = evaluations;
        const newData = [...this.barChartData.datasets[0].data];
        newData[5] = evaluations.length;
        this.barChartData.datasets[0].data = newData;
        this.totalEvaluations = evaluations.length;

        // On crée un NOUVEL objet data pour forcer le rafraîchissement
        // mise du graphe dans le dernier chargement pour être sûr que tout est prêt
        // avant d'actualiser le graphique.
        this.barChartData = {
          ...this.barChartData, // Copie des labels
          datasets: [
            {
              ...this.barChartData.datasets[0], // Copie des autres propriétés du dataset
              data: newData, // Utilise les nouvelles données
            },
          ],
        };
      },
      error: (error) => {
        console.error(
          "Erreur lors de la récupération du nombre d'évaluations",
          error
        );
      },
    });
  }
}
