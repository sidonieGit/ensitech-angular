import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { TeachersService } from 'src/app/services/teachers/teachers.service';

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

  // Données pour le graphique, initialisées avec des zéros.
  // Elles seront mises à jour lorsque les données de l'API arriveront.
  public barChartData = {
    labels: ['Enseignants', 'Etudiants', 'Cours'],
    datasets: [
      {
        label: 'Effectif',
        data: [0, 0, 0], // On commence à 0
        backgroundColor: ['#006699', '#f1bb35', '#38a3a5'],
        borderColor: ['#f3f4f6', '#f3f4f6', '#f3f4f6'],
        borderWidth: 1,
        hoverBackgroundColor: ['#444a58', '#444a58', '#444a58'],
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
    private coursesService: CoursesService
  ) {}

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

        console.log(`Nombre total d'enseignants : ${this.totalTeachers}`);
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

    /*
    // --- Chargement des données des étudiants (gardé commenté comme demandé) ---
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.totalStudents = students.length;

        // Mettre à jour les données du graphique
        const newData = [...this.barChartData.datasets[0].data];
        newData[1] = this.totalStudents;
        this.barChartData.datasets[0].data = newData;

        console.log(`Nombre total d'étudiants : ${this.totalStudents}`);
      },
      error: (error) => {
        console.error("Erreur lors de la récupération du nombre d'étudiants", error);
        this.totalStudents = 0;
      }
    });
    */

    /*
    // --- Chargement des données des cours (gardé commenté comme demandé) ---
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.totalCourses = courses.length;

        // Mettre à jour les données du graphique
        const newData = [...this.barChartData.datasets[0].data];
        newData[2] = this.totalCourses;
        this.barChartData.datasets[0].data = newData;

        console.log(`Nombre total de cours : ${this.totalCourses}`);
      },
      error: (error) => {
        console.error("Erreur lors de la récupération du nombre de cours", error);
        this.totalCourses = 0;
      }
    });
    */
  }
}
