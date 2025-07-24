import { Component, OnInit } from '@angular/core';
import { CoursModel } from 'src/app/components/gestion-cours/cours.model';
import { CoursesService } from 'src/app/services/courses/courses2.service';

@Component({
  selector: 'app-gestion-courses',
  templateUrl: './gestion-cours.component.html',
  styleUrls: ['./gestion-cours.component.css'],
})
export class GestionCoursComponent implements OnInit {
  courses: CoursModel[] = [];
  filtername: string = '';
  selectedCourse: CoursModel | null = null;
  editingCourse: CoursModel | null = null;
  filteredCourses: CoursModel[] = [];
  newCourse: CoursModel = {
    intitule: '',
    coefficient: 0,
    nombreHeures: 0,
  };

  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    //  this.courses = this.coursesService.getCourses();
    //this.updateFilteredCourses();
    this.coursesService.getAllCourses().subscribe((data) => {
      this.courses = data;
      this.updateFilteredCourses();
    });
  }

  addCourse(): void {
    if (this.newCourse.intitule) {
      // Vérifiez que le titre est présent
      /*this.coursesService.addCourse(this.newCourse);
      this.loadCourses();
      this.resetForm();*/
      this.coursesService.createCourse(this.newCourse).subscribe({
        next: (resp) => {
          console.log('Cours saved:', resp);
          this.loadCourses();
          this.resetForm();
        }, error: (err) => console.error('Error saving course:', err)
      });
    }
  }

  updateFilteredCourses(): void {
    this.filteredCourses = this.courses.filter((course) =>
      course.intitule.toLowerCase().includes(this.filtername.toLowerCase())
    );
  }

  resetForm(): void {
    this.newCourse = {
      intitule: '',
      coefficient: 0,
      nombreHeures: 0,
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

  viewCourse(course: CoursModel): void {
    this.selectedCourse = course;
  }

  editCourse(course: CoursModel): void {
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
        error: (err) => console.error('Error editing cours:', err)
      });
    }
  }
}
