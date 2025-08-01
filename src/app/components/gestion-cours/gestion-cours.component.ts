import { Component, OnInit } from '@angular/core';
// import { CoursModel } from 'src/app/components/gestion-cours/cours.model';
import { Course } from 'src/app/interfaces/course.model'; // Utiliser notre interface standard
import { CoursesService } from 'src/app/services/courses/courses.service';

@Component({
  selector: 'app-gestion-courses',
  templateUrl: './gestion-cours.component.html',
  styleUrls: ['./gestion-cours.component.css'],
})
export class GestionCoursComponent implements OnInit {
  courses: Course[] = [];
  filtername: string = '';
  selectedCourse: Course | null = null;
  editingCourse: Course | null = null;
  filteredCourses: Course[] = [];
  newCourse: Course = {
    title: '',
    coefficient: 0,
    hours: 0,
  };

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    //  this.courses = this.coursesService.getCourses();
    //this.updateFilteredCourses();
    this.coursesService.getCourses().subscribe((data) => {
      this.courses = data;
      this.updateFilteredCourses();
    });
  }

  addCourse(): void {
    if (this.newCourse.title) {
      // Vérifiez que le titre est présent
      /*this.coursesService.addCourse(this.newCourse);
      this.loadCourses();
      this.resetForm();*/
      this.coursesService.createCourse(this.newCourse).subscribe({
        next: (resp) => {
          console.log('Cours saved:', resp);
          this.loadCourses();
          this.resetForm();
        },
        error: (err) => console.error('Error saving course:', err),
      });
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
      coefficient: 0,
      hours: 0,
    };
  }

  deleteCourse(id: number | undefined): void {
    if (id) {
      this.coursesService.deleteCourse(id).subscribe((isDeleted) => {
        if (isDeleted) {
          this.loadCourses();
        } else {
          console.error(`Failed to delete course with id ${id}`);
        }
      });
    }
  }

  viewCourse(course: Course): void {
    this.selectedCourse = course;
  }

  editCourse(course: Course): void {
    this.editingCourse = { ...course };
  }

  saveEditCourse(): void {
    if (this.editingCourse) {
      this.coursesService.updateCourse(this.editingCourse).subscribe({
        next: (resp) => {
          console.log('Cours edit:', resp);
          this.loadCourses();
          this.editingCourse = null;
        },
        error: (err) => console.error('Error editing cours:', err),
      });
    }
  }
}
