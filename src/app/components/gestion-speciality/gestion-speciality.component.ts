import { Component, OnInit } from '@angular/core';
import { Speciality } from 'src/app/interfaces/speciality.interface';

@Component({
  selector: 'app-gestion-speciality',
  templateUrl: './gestion-speciality.component.html',
  styleUrls: ['./gestion-speciality.component.css'],
})
export class GestionSpecialityComponent implements OnInit {
  filtername: string = '';
  selectedSpeciality: Speciality | null = null;
  editingSpeciality: Speciality | null = null;
  newSpeciality: Speciality = {
    id:0,
    label: '',
    description: '',
  };
  specialities: Speciality[] = [
    { id: 1, label: 'Informatique', description: 'Spécialité en informatique' },
    { id: 2, label: 'Réseaux', description: 'Spécialité en réseaux' },
    { id: 3, label: 'Sécurité', description: 'Spécialité en sécurité' },
  ];

  newSpecialities : Speciality[] = [];

  filteredSpecialities: Speciality[] = [];

  ngOnInit(): void {
    this.filteredSpecialities = this.specialities;
  }

  updateFilteredSpecialities(): void {
    this.filteredSpecialities = this.specialities.filter((speciality) =>
      speciality.label.toLowerCase().includes(this.filtername.toLowerCase())
    );
  }

  addSpeciality(newSpeciality: Speciality): void {
    if (newSpeciality.label && newSpeciality.description) {
        this.newSpeciality.id= this.specialities.length + 1; // Simple ID generation
        // Copy the new speciality
        this.specialities.push(this.newSpeciality);
        this.newSpeciality.id = this.specialities.length; // Update ID after adding
        this.resetForm();
        this.updateFilteredSpecialities();
    }
  }

  deleteSpeciality(id: number | undefined): void {
    this.specialities = this.specialities.filter(
      (speciality) => speciality.id !== id
    );
    this.updateFilteredSpecialities();
  }

  editSpeciality(speciality: Speciality): void {
    this.editingSpeciality = { ...speciality };
  }
  viewSpeciality(speciality: Speciality): void {
    this.selectedSpeciality = speciality;
  }

  saveEditSpeciality(): void {

  }

  resetForm(): void {
    this.newSpeciality = {
      label: '',
      description: '',
    };
  }
}
