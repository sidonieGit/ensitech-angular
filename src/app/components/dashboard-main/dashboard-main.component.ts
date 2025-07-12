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
  totalStudents: number = 0;
  totalCourses: number = 0;
  totalTeachers: number = 0;
  constructor(
    private studentService: StudentsService,
    private teacherService: TeachersService,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.totalStudents = this.studentService.getStudents().length;
    this.totalCourses = this.coursesService.getCourses().length;
    this.totalTeachers = this.teacherService.getTeachers().length;
  }

  // Données pour le graphique
  public barChartData = {
    labels: ['Enseignants', 'Etudiants', 'Cours'], // Noms des catégories
    datasets: [
      {
        label: 'Effectif',
        data: [
          this.teacherService.getTeachers().length,
          this.studentService.getStudents().length,
          this.coursesService.getCourses().length,
        ], // Données correspondantes
        backgroundColor: ['#006699', '#f1bb35', '#38a3a5'], // Couleurs des barres
        borderColor: ['#f3f4f6', '#f3f4f6', '#f3f4f6'], // Couleurs des bordures
        borderWidth: 1,
        hoverBackgroundColor: ['#444a58', '#444a58', '#444a58'],
      },
    ],
    options: [
      {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    ],
  };
  // Options de configuration
}
