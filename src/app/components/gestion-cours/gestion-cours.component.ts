import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  loading: boolean = false;
  errorMsg: string = '';

  constructor(
    private coursesService: CoursesService,
    private toastr: ToastrService
  ) {}

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
      this.loading = true;
      this.errorMsg = '';
      this.coursesService.createCourse(this.newCourse).subscribe({
        next: (resp) => {
          this.toastr.success('Cours créé', 'Succès !');
          console.log('Cours saved:', resp);
          this.loading = false;
          this.loadCourses();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error saving course:', err);
          this.loading = false;
          this.toastr.error("Erreur lors de l'ajout du cours.", 'Erreur !');
        },
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
    // 1. Vérifier que l'ID n'est pas undefined
    if (id === undefined) {
      console.error('Tentative de suppression avec un ID indéfini.');
      return;
    }

    // 2. Utiliser la fonction confirm() native du navigateur
    const confirmation = window.confirm(
      'Êtes-vous sûr de vouloir supprimer ce cours ?'
    );
    // Ou plus simplement : const confirmation = confirm('...');

    // 3. Agir en fonction de la réponse de l'utilisateur
    if (confirmation) {
      // Si l'utilisateur a cliqué sur "OK"
      this.coursesService.deleteCourse(id).subscribe({
        next: (isDeleted: boolean) => {
          if (isDeleted) {
            this.toastr.success(
              'Le cours a été supprimé avec succès.',
              'Succès !'
            );
            this.loadCourses(); // Recharger la liste pour refléter la suppression
          } else {
            this.toastr.error('La suppression du cours a échoué.', 'Erreur');
            console.error(`La suppression du cours avec l'ID ${id} a échoué.`);
          }
        },
        error: (err) => {
          this.toastr.error('Une erreur inattendue est survenue.', 'Erreur !');
          console.error(
            'Erreur réseau ou inattendue lors de la suppression du cours :',
            err
          );
        },
      });
    } else {
      // Si l'utilisateur a cliqué sur "Annuler"
      this.toastr.info('La suppression a été annulée.', 'Information');
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
          this.toastr.success('Cours mis à jour', 'Succès !');
          this.loadCourses();
          this.editingCourse = null;
        },
        error: (err) => console.error('Error editing cours:', err),
      });
    }
  }
}
