import { Component, OnInit } from '@angular/core';
import { Cours } from 'src/app/cours';
import { CoursesService } from 'src/app/services/courses/courses.service';

@Component({
  selector: 'app-gestion-courses',
  templateUrl: './gestion-cours.component.html',
  styleUrls: ['./gestion-cours.component.css'],
})
export class GestionCoursComponent implements OnInit {
  courses: Cours[] = [];
  filtername: string = '';
  selectedCourse: Cours | null = null;
  editingCourse: Cours | null = null;
  filteredCourses: Cours[] = [];
  newCourse: Cours = {
    title: '',
    description: '',
    duration: '',
  };

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courses = this.coursesService.getCourses();
    this.updateFilteredCourses();
  }

  addCourse(): void {
    if (this.newCourse.title) {
      // Vérifiez que le titre est présent
      this.coursesService.addCourse(this.newCourse);
      this.loadCourses();
      this.resetForm();
    }
  }

  updateFilteredCourses(): void {
    this.filteredCourses = this.courses.filter((course) =>
      course.title.toLowerCase().includes(this.filtername.toLowerCase())
    );
  }

  resetForm(): void {
    this.newCourse = {
      title: '',
      description: '',
      duration: '',
    };
  }

  deleteCourse(id: number | undefined): void {
    this.coursesService.deleteCourse(id);
    this.loadCourses();
  }

  viewCourse(course: Cours): void {
    this.selectedCourse = course;
  }

  editCourse(course: Cours): void {
    this.editingCourse = { ...course };
  }

  saveEditCourse(): void {
    if (this.editingCourse) {
      this.coursesService.updateCourse(this.editingCourse);
      this.loadCourses();
      this.editingCourse = null;
    }
  }
}
