import { AcademicYearService } from 'src/app/services/academic-year/academic-year.service';
import { Speciality } from 'src/app/interfaces/speciality.interface';
import { EvaluationsService } from './../../services/evaluations/evaluations.service';
import { SpecialityService } from './../../services/speciality/speciality.service';
import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { TeachersService } from 'src/app/services/teachers/teachers.service';
import { Evaluation } from 'src/app/interfaces/evaluation.model';
import { AcademicYear } from 'src/app/interfaces/academic.model';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

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
  yearInProgressLabel: AcademicYear[] = [];
  latestPreviousYearLabel: AcademicYear[] = [];

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
        backgroundColor: [
          '#006699',
          '#f1bb35',
          '#f20444',
          '#0003ff',
          '#38a3a5',
          '#6a4c93',
        ],
        borderColor: [
          '#f3f4f6',
          '#f3f4f6',
          '#f3f4f6',
          '#f3f4f6',
          '#f3f4f6',
          '#f3f4f6',
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          '#444a58',
          '#444a58',
          '#444a58',
          '#444a58',
          '#444a58',
          '#444a58',
        ],
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

  public registerChart = {
    labels: ['Inscriptions 2025-2026', 'Inscriptions 2024-2025'],
    datasets: [
      {
        label: 'Statistiques',
        data: [0, 0], // On commence à 0
        backgroundColor: ['#006699', '#f1bb35'],
        borderColor: ['#f3f4f6', '#f3f4f6'],
        borderWidth: 1,
        hoverBackgroundColor: ['#444a58', '#444a58'],
      },
    ],
  };
  constructor(
    private studentService: StudentsService,
    private teachersService: TeachersService, // Correction du nom de la variable
    private coursesService: CoursesService,
    private specialityService: SpecialityService,
    private registrationService: RegistrationService,
    private EvaluationsService: EvaluationsService,
    private academicYearService: AcademicYearService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadRegistrationsOverYears();
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
        console.log('Specialities loaded:', this.listSpecialities);

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
        // Compter le nombre d'inscriptions par année académique
        // const groupedByYear = registrations.reduce((acc, r) => {
        //   const year = r.academicYearLabel || 'Inconnue';
        //   acc[year] = (acc[year] || 0) + 1;
        //   return acc;
        // }, {} as Record<string, number>);

        // // Extraire les années (ex: ['2024-2025', '2025-2026'])
        // const years = Object.keys(groupedByYear).sort();

        // // Créer les datasets dynamiques
        // this.registerChart = {
        //   ...this.registerChart,
        //   labels: years,
        //   datasets: [
        //     {
        //       ...this.registerChart.datasets[0],
        //       data: years.map((year) => groupedByYear[year] || 0),
        //     },
        //   ],
        // };

        this.totalRegistrations = registrations.length;

        // mise à jour du graphique global
        const newData = [...this.barChartData.datasets[0].data];
        newData[2] = this.totalRegistrations;
        this.barChartData.datasets[0].data = newData;
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

  // En supposant que academicYearService.getAcademicYears() retourne un Observable<AcademicYear[]>

  yearInProgress(): Observable<string> {
    return this.academicYearService.getAcademicYears().pipe(
      map((academicYears) => {
        const year = academicYears.find((year) => year.status === 'EN_COURS');
        return year ? year.label : 'Aucune année en cours';
      }),
      catchError((err) => {
        console.error(`Erreur de chargement de l'année académique`, err);
        // Retourne un Observable qui émet la valeur d'erreur pour que le flux continue (optionnel)
        return of('Erreur de chargement');
      })
    );
  }

  latestPreviousYear() {
    this.academicYearService.getAcademicYears().subscribe({
      next: (academicYear) => {
        const previousYears = academicYear
          .filter((year) => year.status === 'TERMINÉE')
          .sort((a, b) => b.label.localeCompare(a.label)); // Trier par label décroissant
        return previousYears.length > 0
          ? previousYears[0].label
          : 'Aucune année terminée';
      },
      error: (err) => {
        console.error(`Erreur de chargement de l'année académique`);
        return 'Erreur de chargement';
      },
    });
  }

  loadRegistrationsOverYears(): void {
    // Charger toutes les années académiques
    this.academicYearService
      .getAcademicYears()
      .pipe(
        map((years) => {
          // Trier par label croissant (ex: 2020-2021 → 2024-2025)
          return years.sort((a, b) => a.label.localeCompare(b.label));
        }),
        map((sortedYears) => {
          // Trouver l'année en cours
          const currentYearIndex = sortedYears.findIndex(
            (year) => year.status === 'EN_COURS'
          );

          if (currentYearIndex === -1) {
            throw new Error('Aucune année en cours trouvée !');
          }

          // Garder les 4 années précédentes + l’année en cours
          const startIndex = Math.max(0, currentYearIndex - 4);
          const selectedYears = sortedYears.slice(
            startIndex,
            currentYearIndex + 1
          );

          return selectedYears;
        }),
        switchMap((selectedYears) => {
          // Charger toutes les inscriptions
          return this.registrationService.getRegistrations().pipe(
            map((registrations) => {
              // Compter les inscriptions par année sélectionnée
              const counts = selectedYears.map((year) => {
                const count = registrations.filter(
                  (r) => r.academicYearLabel === year.label
                ).length;
                return { label: year.label, count };
              });
              return counts;
            })
          );
        }),
        catchError((err) => {
          console.error(
            'Erreur lors du chargement des inscriptions par année :',
            err
          );
          return of([]);
        })
      )
      .subscribe((counts) => {
        // Mettre à jour le graphique
        if (counts.length > 0) {
          const labels = counts.map((c) => c.label);
          const data = counts.map((c) => c.count);
          const backgroundColors = labels.map(
            (label) =>
              label === labels[labels.length - 1] ? '#38a3a5' : '#f1bb35' // vert pour en cours
          );

          this.registerChart = {
            ...this.registerChart,
            labels,
            datasets: [
              {
                ...this.registerChart.datasets[0],
                data,
                backgroundColor: backgroundColors,
              },
            ],
          };
        }
      });
  }
}
