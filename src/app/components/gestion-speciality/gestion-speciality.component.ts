import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Course } from 'src/app/interfaces/course.model';
import { Speciality } from 'src/app/interfaces/speciality.interface';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { SpecialityService } from 'src/app/services/speciality/speciality.service';
@Component({
  selector: 'app-gestion-speciality',
  templateUrl: './gestion-speciality.component.html',
  styleUrls: ['./gestion-speciality.component.css'],
})
export class GestionSpecialityComponent {
  filtername: string = '';
  selectedSpeciality: Speciality | null = null;
  editingSpeciality: Speciality | null = null;

  displayedSpecialities: Speciality[] = []; // ✅ données visibles (pagination + filtre)

  newSpeciality: Speciality = {
    id: 0,
    label: '',
    description: '',
    cycle: '',
    courses: [],
  };
  allCourses: Course[] = [];
  specialities: Speciality[] = [];

  newSpecialities: Speciality[] = [];

  filteredSpecialities: Speciality[] = [];
  loading: boolean = false;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private specialityService: SpecialityService,
    private coursesService: CoursesService,
    private toastr: ToastrService
  ) {
    this.loadSpecialities();
    this.loadCourses();
  }

  //initialisation des spécialités

  updateFilteredSpecialities(): void {
    this.filteredSpecialities = this.specialities.filter((speciality) =>
      speciality.label.toLowerCase().includes(this.filtername.toLowerCase())
    );
    this.currentPage = 1; // reset sur page 1
    this.updateDisplayedSpecialities();
  }

  updateDisplayedSpecialities(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedSpecialities = this.filteredSpecialities.slice(start, end);
  }
  loadSpecialities() {
    this.loading = true;
    this.specialityService.getSpecialities().subscribe({
      next: (data) => {
        this.loading = false;
        this.specialities = data;
        this.updateFilteredSpecialities();
      },
      error: (error) => {
        this.loading = false;
        console.error('Erreur lors du chargement des spécialités', error);
        this.toastr.error(
          'Erreur lors du chargement des spécialités',
          'Erreur !'
        );
      },
    });
  }

  loadCourses() {
    this.loading = true;
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        this.loading = false;
        this.allCourses = data;
      },
      error: (error) => {
        this.loading = false;
        const errorMsg =
          error?.error?.message ?? 'Une erreur inattendue est survenue';
        this.toastr.error(errorMsg, 'Erreur !');
      },
    });
  }
  addSpeciality(newSpeciality: Speciality): void {
    if (newSpeciality.label && newSpeciality.cycle) {
      this.loading = true;
      this.specialityService.addSpeciality(newSpeciality).subscribe({
        next: (data) => {
          this.loading = false;
          this.toastr.success('Spécialité ajoutée', 'Succès !');
          /*this.specialities.push(data);
          this.updateFilteredSpecialities();*/
          this.loadSpecialities();
          this.resetForm();
        },
        error: (error) => {
          this.loading = false;
          //console.log('Error saving course:', error?.error?.message);
          console.error("Erreur lors de l'ajout de la spécialité", error);
          const errorMsg =
            error?.error?.message ?? 'Une erreur inattendue est survenue';
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

  deleteSpeciality(id: number | undefined): void {
    if (id === undefined) {
      console.error('Tentative de suppression avec un ID indéfini.');
      return;
    } else {
      const confirmation = window.confirm(
        'Êtes-vous sûr de vouloir supprimer cette spécialité ?'
      );
      if (confirmation) {
        this.loading = true;
        this.specialityService.deleteSpeciality(id).subscribe({
          next: () => {
            this.toastr.success('Spécialité supprimée', 'Succès !');
            this.loadSpecialities();
            /*this.specialities = this.specialities.filter(
              (speciality) => speciality.id !== id
            );
            this.updateFilteredSpecialities();*/
          },
          error: (error) => {
            this.loading = false;
            /*console.error(
              'Erreur lors de la suppression de la spécialité',
              error
            );
            this.toastr.error(
              'Erreur lors de la suppression de la spécialité',
              'Erreur !'
            );*/
            const errorMsg =
              error?.error?.message ?? 'Une erreur inattendue est survenue';
            this.toastr.error(errorMsg, 'Erreur !');
          },
        });
      }
    }
  }
  updateSpeciality(speciality: Speciality): void {
    if (speciality && speciality.id && speciality.label && speciality.cycle) {
      this.loading = true;
      this.specialityService.updateSpeciality(speciality).subscribe({
        next: (data) => {
          this.toastr.success('Spécialité mise à jour', 'Succès !');
          this.loading = false;
          this.loadSpecialities();
          /*this.specialities = this.specialities.map((s) => {
            if (s.id === data.id) {
              return data;
            }
            return s;
          });
          this.updateFilteredSpecialities();*/
        },
        error: (error) => {
          this.loading = false;
          /*console.error(
            'Erreur lors de la mise à jour de la spécialité',
            error
          );
          this.toastr.error(
            'Erreur lors de la mise à jour de la spécialité',
            'Erreur !'
          );*/
          const errorMsg =
            error?.error?.message ?? 'Une erreur inattendue est survenue';
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

  editSpeciality(speciality: Speciality): void {
    this.editingSpeciality = { ...speciality };
    this.editingSpeciality.selectedCourses =
      this.editingSpeciality.courses?.map((course) => course.id) || [];
  }
  viewSpeciality(speciality: Speciality): void {
    this.selectedSpeciality = speciality;
  }

  saveEditSpeciality(): void {
    if (this.editingSpeciality) {
      this.loading = true;
      this.editingSpeciality.courses = this.allCourses.filter((course) =>
        this.editingSpeciality?.selectedCourses?.includes(course.id)
      );
      this.specialityService
        .updateSpeciality(this.editingSpeciality)
        .subscribe({
          next: (data) => {
            this.loading = false;
            this.toastr.success('Spécialité mise à jour', 'Succès !');
            this.loadSpecialities();
            /*this.specialities = this.specialities.map((s) => {
              if (s.id === data.id) {
                return data;
              }
              return s;
            });
            this.updateFilteredSpecialities();*/
          },
          error: (error) => {
            this.loading = false;
            /*console.error(
              'Erreur lors de la mise à jour de la spécialité',
              error
            );
            this.toastr.error(
              'Erreur lors de la mise à jour de la spécialité',
              'Erreur !'
            );*/
            const errorMsg =
              error?.error?.message ?? 'Une erreur inattendue est survenue';
            this.toastr.error(errorMsg, 'Erreur !');
          },
        });
    }
  }

  resetForm(): void {
    this.newSpeciality = {
      label: '',
      description: '',
    };
  }

  // for pagination
  get paginatedSpecialities() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSpecialities.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(value: number): void {
    this.itemsPerPage = value;
    this.currentPage = 1;
  }
}
