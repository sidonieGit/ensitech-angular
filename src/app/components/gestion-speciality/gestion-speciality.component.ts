import { Component } from '@angular/core';
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

  constructor(private specialityService: SpecialityService) {
    this.loadSpecialities();
  }

  //initialisation des spécialités

  updateFilteredSpecialities(): void {
    this.filteredSpecialities = this.specialities.filter((speciality) =>
      speciality.label.toLowerCase().includes(this.filtername.toLowerCase())
    );
  }
  loadSpecialities() {
    this.specialityService.getSpecialities().subscribe({
      next: (data) => {
        this.specialities = data;
        this.updateFilteredSpecialities();
      },
      error: (error) =>
        console.error('Erreur lors du chargement des spécialités', error),
    });
  }
  addSpeciality(newSpeciality: Speciality): void {
    if (newSpeciality.label && newSpeciality.description) {
      this.specialityService.addSpeciality(newSpeciality).subscribe({
        next: (data) => {
          this.specialities.push(data);
          this.updateFilteredSpecialities();
          this.resetForm();
        },
        error: (error) =>
          console.error("Erreur lors de l'ajout de la spécialité", error),
      });
    }
  }

  deleteSpeciality(id: number | undefined): void {
    if (id) {
      this.specialityService.deleteSpeciality(id).subscribe({
        next: () => {
          this.specialities = this.specialities.filter(
            (speciality) => speciality.id !== id
          );
          this.updateFilteredSpecialities();
        },
        error: (error) =>
          console.error(
            'Erreur lors de la suppression de la spécialité',
            error
          ),
      });
    }
  }
  updateSpeciality(speciality: Speciality): void {
    if (speciality.id) {
      this.specialityService.updateSpeciality(speciality).subscribe({
        next: (data) => {
          this.specialities = this.specialities.map((s) => {
            if (s.id === data.id) {
              return data;
            }
            return s;
          });
          this.updateFilteredSpecialities();
        },
        error: (error) =>
          console.error(
            'Erreur lors de la mise à jour de la spécialité',
            error
          ),
      });
    }
  }

  editSpeciality(speciality: Speciality): void {
    this.editingSpeciality = { ...speciality };
  }
  viewSpeciality(speciality: Speciality): void {
    this.selectedSpeciality = speciality;
  }

  saveEditSpeciality(): void {}

  resetForm(): void {
    this.newSpeciality = {
      label: '',
      description: '',
    };
  }
}
