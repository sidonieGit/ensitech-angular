import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AcademicYear } from 'src/app/interfaces/academic.model';
import { Registration } from 'src/app/interfaces/registration.model';
import { Speciality } from 'src/app/interfaces/speciality.interface';
import { Student } from 'src/app/interfaces/students.model';
import { AcademicYearService } from 'src/app/services/academic-year/academic-year.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { SpecialityService } from 'src/app/services/speciality/speciality.service';
import { StudentsService } from 'src/app/services/students/students.service';

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
  specialities: Speciality[] = [];
  academicYears: AcademicYear[] = [];
  students: Student[] = [];
  // editingRegistration = { ...this.newRegistration };

  // test for datalist
  list = ['Paris', 'Londres', 'Kinshasa', 'Dakar'];
  selectedValue = '';

  registrationService: RegistrationService = inject(RegistrationService);
  toastr: ToastrService = inject(ToastrService);
  specialityService: SpecialityService = inject(SpecialityService);
  academicYearService = inject(AcademicYearService);
  studentService = inject(StudentsService);

  ngOnInit(): void {
    this.loadRegistrations();
    this.loadSpecialities();
    this.loadAcademicYears();
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (err) => {
        this.toastr.error(`Erreur de chargement de la liste des étudiants`);
      },
    });
  }

  loadAcademicYears(): void {
    this.academicYearService.getAcademicYears().subscribe({
      next: (academicYear) => {
        this.academicYears = academicYear;
      },
      error: (err) => {
        this.toastr.error(`Erreur de chargement des années académiques`);
      },
    });
  }

  loadSpecialities(): void {
    this.specialityService.getSpecialities().subscribe({
      next: (speciality) => {
        this.specialities = speciality;
      },
      error: (err) => {
        this.toastr.error(`Erreur de chargement des specialités`);
      },
    });
  }

  loadRegistrations(): void {
    // Logic to load registrations from a service
    this.registrationService.getRegistrations().subscribe({
      next: (data) => {
        // this.registration
        this.registrations = data;
        this.filteredRegistrations = data;
        // this.updateFilteredRegistrations;
      },
      error: (err) => {
        this.toastr.error(`Erreur de chargement des inscriptions `);
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
          // console.log('Enregistrement ajouté avec succès', data);
          this.loadRegistrations(); // Recharger la liste après l'ajout
        },
        error: (err) => {
          this.toastr.error(
            `Erreur lors de l'ajout d'un enregistrement : ${err}`,
            'Erreur !'
          );
          // console.error("Erreur lors de l'ajout d'un enregistrement", err);
        },
      });
      this.resetForm();
    }
  }

  editRegistration(registration: Registration) {
    // Logic to edit an existing registration
    this.editingRegistration = { ...registration };
  }

  updateRegistration() {
    if (this.editingRegistration) {
      this.registrationService
        .updateRegistration(this.editingRegistration)
        .subscribe({
          next: (data) => {
            this.toastr.success(
              `L'enregistrement ${data.registrationNumber} a été mis à jour.`,
              'Succès !'
            );
            this.loadRegistrations(); // Recharger la liste après la mise à jour
            this.editingRegistration = null; // Réinitialiser l'édition
          },
          error: (err) => {
            this.toastr.error(
              `Erreur lors de la mise à jour de l'enregistrement : ${err}`,
              'Erreur !'
            );
          },
        });
    }
  }

  deleteRegistration(id: number | undefined) {
    let query = confirm(
      'Êtes-vous sûr de vouloir supprimer cette inscription ?'
    );
    if (id !== undefined && query) {
      this.registrationService.deleteRegistration(id).subscribe({
        next: () => {
          this.toastr.success(`L'enregistrement a été supprimé.`, 'Succès !');
          this.loadRegistrations(); // Recharger la liste après la suppression
        },
        error: (err) => {
          this.toastr.error(
            `Erreur lors de la suppression de l'enregistrement : ${err}`,
            'Erreur !'
          );
        },
      });
    }
  }

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
