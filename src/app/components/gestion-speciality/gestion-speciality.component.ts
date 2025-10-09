import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Speciality } from 'src/app/interfaces/speciality.interface';
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
  newSpeciality: Speciality = {
    id: 0,
    label: '',
    description: '',
    cycle: '',
    courses: [],
  };
  specialities: Speciality[] = [];

  newSpecialities: Speciality[] = [];

  filteredSpecialities: Speciality[] = [];
  loading: boolean = false;

  constructor(
    private specialityService: SpecialityService,
    private toastr: ToastrService
  ) {
    this.loadSpecialities();
  }

  //initialisation des spécialités

  updateFilteredSpecialities(): void {
    this.filteredSpecialities = this.specialities.filter((speciality) =>
      speciality.label.toLowerCase().includes(this.filtername.toLowerCase())
    );
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
  addSpeciality(newSpeciality: Speciality): void {
    if (newSpeciality.label && newSpeciality.description) {
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
          const errorMsg = error?.error?.message ?? 'Une erreur inattendue est survenue';
          this.toastr.error(errorMsg, 'Erreur !');
        },
      });
    } else {
      this.toastr.error('Veuillez remplir tous les champs correctement.', 'Erreur !');
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
            const errorMsg = error?.error?.message ?? 'Une erreur inattendue est survenue';
            this.toastr.error(errorMsg, 'Erreur !');
          },
        });
      }
    }
  }
  updateSpeciality(speciality: Speciality): void {
    if (speciality.id && speciality.label) {
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
          const errorMsg = error?.error?.message ?? 'Une erreur inattendue est survenue';
          this.toastr.error(errorMsg, 'Erreur !');
        },
      });
    } else {
      this.toastr.error('Veuillez remplir tous les champs correctement.', 'Erreur !');
    }
  }

  editSpeciality(speciality: Speciality): void {
    this.editingSpeciality = { ...speciality };
  }
  viewSpeciality(speciality: Speciality): void {
    this.selectedSpeciality = speciality;
  }

  saveEditSpeciality(): void {
    if (this.editingSpeciality) {
      this.loading = true;
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
            const errorMsg = error?.error?.message ?? 'Une erreur inattendue est survenue';
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
}
