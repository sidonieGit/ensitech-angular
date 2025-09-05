import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Registration } from 'src/app/interfaces/registration.model';
import { RegistrationService } from 'src/app/services/registration/registration.service';

@Component({
  selector: 'app-gestion-registration',
  templateUrl: './gestion-registration.component.html',
  styleUrls: ['./gestion-registration.component.css'],
})
export class GestionRegistrationComponent implements OnInit {
  selectedRegistration: Registration | null = null;
  editingRegistration: Registration | null = null;
  filteredRegistrations: Registration[] = [];
  filtername: string = '';
  newRegistration = {
    // registrationNumber: '',
    level: '',
    specialityLabel: '',
    matricule: '',
    academicYearLabel: '',
  };
  registrations: Registration[] = [];

  // editingRegistration = { ...this.newRegistration };

  registrationService: RegistrationService = inject(RegistrationService);
  toastr: ToastrService = inject(ToastrService);

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    // Logic to load registrations from a service
    // For example, this could be a call to a service that fetches registrations
    this.registrationService.getRegistrations().subscribe({
      next: (data) => {
        // this.registration

        this.registrations = data;
        this.filteredRegistrations = data;
        // this.updateFilteredRegistrations;
      },
      error: (err) => {
        console.error('Erreur lors du chargement', err);
      },
    });
  }
  viewRegistration(registration: Registration) {
    this.selectedRegistration = registration;
  }
  updateFilteredRegistrations() {
    // Logic to filter registrations based on filtername
    this.filteredRegistrations = this.filteredRegistrations.filter(
      (registration) =>
        registration.matricule
          .toLowerCase()
          .includes(this.filtername.toLowerCase())
    );
  }

  addRegistration() {
    // Logic to add a new registration
    if (
      this.newRegistration.level &&
      this.newRegistration.specialityLabel &&
      this.newRegistration.matricule &&
      this.newRegistration.academicYearLabel
    ) {
      this.registrationService.addRegistration(this.newRegistration).subscribe({
        next: (data) => {
          this.toastr.success(
            `L'enregistrement ${data.registrationNumber} a été ajouté.`,
            'Succès !'
          );

          console.log('Enregistrement ajouté avec succès', data);
          this.loadRegistrations(); // Recharger la liste après l'ajout
        },
        error: (err) => {
          this.toastr.error(
            `Erreur lors de l'ajout d'un enregistrement : ${err}`,
            'Erreur !'
          );
          console.error("Erreur lors de l'ajout d'un enregistrement", err);
        },
      });
      this.resetForm();
    }
  }

  editRegistration(registration: Registration) {
    // Logic to edit an existing registration
    this.editingRegistration = { ...registration };
  }

  deleteRegistration() {}

  saveEditRegistration() {}

  resetForm() {
    this.newRegistration = {
      // registrationNumber: '',
      level: '',
      specialityLabel: '',
      matricule: '',
      academicYearLabel: '',
    };
  }
}
