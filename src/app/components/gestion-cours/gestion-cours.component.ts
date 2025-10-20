import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { CoursModel } from 'src/app/components/gestion-cours/cours.model';
import { Course } from 'src/app/interfaces/course.model'; // Utiliser notre interface standard
import { Teacher } from 'src/app/interfaces/teachers.model';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { TeachersService } from 'src/app/services/teachers/teachers.service';

@Component({
  selector: 'app-gestion-courses',
  templateUrl: './gestion-cours.component.html',
  styleUrls: ['./gestion-cours.component.css'],
})
export class GestionCoursComponent implements OnInit {
  allTeachers: Teacher[] = [];
  courses: Course[] = [];
  filtername: string = '';
  selectedCourse: Course | null = null;
  editingCourse: Course | null = null;
  filteredCourses: Course[] = [];
  displayedCourses: Course[] = []; // ✅ données visibles (pagination + filtre)
  newCourse: Course = {
    title: '',
    coefficient: 0,
    hours: 0,
    teacher: null,
    teacherId: 0,
  };
  loading: boolean = false;
  errorMsg: string = '';

  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private coursesService: CoursesService,
    private teachersService: TeachersService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    this.loadTeacher();
  }

  loadCourses(): void {
    //  this.courses = this.coursesService.getCourses();
    //this.updateFilteredCourses();
    this.loading = true;
    this.coursesService.getCourses().subscribe((data) => {
      this.courses = data;
      this.loading = false;
      this.updateFilteredCourses();
    });
  }

  loadTeacher() {
    this.loading = true;
    this.teachersService.getTeachers().subscribe({
      next: (data) => {
        this.loading = false;
        this.allTeachers = data;
      },
      error: (error) => {
        console.error('Erreur chargement des étudiants', error);
        this.loading = false;
        const errorMsg =
          error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
      },
    });
  }
  addCourse(): void {
    if (
      this.newCourse.title &&
      this.newCourse.title.trim() !== '' &&
      this.newCourse.coefficient &&
      this.newCourse.coefficient > 0 &&
      this.newCourse.hours &&
      this.newCourse.hours > 0
    ) {
      // Vérifiez que le titre est présent
      /*this.coursesService.addCourse(this.newCourse);
      this.loadCourses();
      this.resetForm();*/
      this.loading = true;
      this.errorMsg = '';
      if (this.newCourse.teacher) {
        this.newCourse.teacherId = this.newCourse.teacher?.id;
      } else if (this.newCourse.teacherId === 0) {
        this.newCourse.teacherId = null;
      }
      this.coursesService.createCourse(this.newCourse).subscribe({
        next: (resp) => {
          this.toastr.success('Cours créé', 'Succès !');
          console.log('Cours saved:', resp);
          this.loading = false;
          this.loadCourses();
          this.resetForm();
        },
        error: (err: HttpErrorResponse) => {
          //console.error('Error saving course:', err);
          //  console.log('Error saving course:', err?.error?.message);
          this.loading = false;
          const errorMsg =
            err?.error?.message ?? 'Erreur lors de la création du cours.';
          this.toastr.error(errorMsg, 'Erreur !');
          // this.toastr.error("Erreur lors de l'ajout du cours.", 'Erreur !');
        },
      });
    } else {
      this.toastr.error(
        'Veuillez remplir tous les champs correctement.',
        'Erreur !'
      );
    }
  }

  updateFilteredCourses(): void {
    this.filteredCourses = this.courses.filter((course) =>
      course.title.toLowerCase().includes(this.filtername.toLowerCase())
    );
    this.currentPage = 1; // reset sur page 1
    this.updateDisplayedCourses();
  }

  updateDisplayedCourses(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedCourses = this.filteredCourses.slice(start, end);
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
      this.loading = true;
      // Si l'utilisateur a cliqué sur "OK"
      this.coursesService.deleteCourse(id).subscribe({
        next: (isDeleted: boolean) => {
          if (isDeleted) {
            this.toastr.success(
              'Le cours a été supprimé avec succès.',
              'Succès !'
            );
            this.loading = false;
            // this.loading = false;
            this.loadCourses(); // Recharger la liste pour refléter la suppression
          } else {

            this.toastr.error('La suppression du cours a échoué.', 'Erreur');
            // console.error(`La suppression du cours avec l'ID ${id} a échoué.`);
            this.loading = false;
          }
        },
        error: (err) => {
          /*this.toastr.error('Une erreur inattendue est survenue.', 'Erreur !');
          console.error(
            'Erreur réseau ou inattendue lors de la suppression du cours :',
            err
          );*/
          this.loading = false;
          let errorMsg =
            err?.error?.message ?? 'Une erreur inattendue est survenue';
          if (err?.error?.message?.includes("constraint")) {
            errorMsg = "Impossible de supprimer ce cours car il est lié à au moin un autre enregistrement.";
          }
          this.toastr.error(errorMsg, 'Erreur !');
          // console.log("ddd", err.error.message)
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
    // console.log("teacher ///", this.editingCourse?.teacher)
    if (
      this.editingCourse &&
      this.editingCourse.title &&
      this.editingCourse.title.trim() !== '' &&
      this.editingCourse.coefficient &&
      this.editingCourse.coefficient > 0 &&
      this.editingCourse.hours &&
      this.editingCourse.hours > 0
    ) {
      // console.log("teacher", this.editingCourse)
      this.loading = true;
      /*if (this.editingCourse.teacher) {
        this.editingCourse.teacherId = this.editingCourse.teacher.id;
      }*/

      this.coursesService.updateCourse(this.editingCourse).subscribe({
        next: (resp) => {
          this.loading = false;
          console.log('Cours edit:', resp);
          this.toastr.success('Cours mis à jour', 'Succès !');
          this.loadCourses();
          this.editingCourse = null;
        },
        // error: (err) => console.error('Error editing cours:', err),
        error: (err) => {
          this.loading = false;
          const errorMsg =
            err?.error?.message ?? 'Une erreur inattendue est survenue';
          this.toastr.error(errorMsg, 'Erreur !');
        },
      });
    } else {
      this.toastr.error(
        'Veuillez remplir tous les champs correctement.',
        'Erreur !'
      );
    }
  }

  // for pagination
  get paginatedCourses() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCourses.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(value: number): void {
    this.itemsPerPage = value;
    this.currentPage = 1;
  }
}
