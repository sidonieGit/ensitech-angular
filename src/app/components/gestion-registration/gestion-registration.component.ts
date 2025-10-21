import { Component, DoCheck, inject, OnInit } from '@angular/core';
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
export class GestionRegistrationComponent implements OnInit, DoCheck {
  selectedRegistration: Registration | null = null;
  editingRegistration: Registration | null = null;
  filteredRegistrations: Registration[] = [];

  displayedRegistrations: Registration[] = [];

  choosenRegistration: Registration | null = null;
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
  allSpecialities: Speciality[] = [];
  academicYears: AcademicYear[] = [];
  students: Student[] = [];
  // editingRegistration = { ...this.newRegistration };


  // test for datalist
  selectedValue = '';


  lastSelectedLevel: string | null = null;

  currentPage = 1;
  itemsPerPage = 5;
  loading: boolean = false;

  registrationService: RegistrationService = inject(RegistrationService);
  toastr: ToastrService = inject(ToastrService);
  specialityService: SpecialityService = inject(SpecialityService);
  academicYearService = inject(AcademicYearService);
  studentService = inject(StudentsService);

  ngOnInit(): void {
    this.loadStudents();
    // this.loadRegistrations();
    this.loadSpecialities();
    this.loadAcademicYears();
  }
  ngDoCheck() {

    if (
      this.newRegistration &&
      this.newRegistration.level &&
      this.newRegistration.level !== this.lastSelectedLevel
    ) {
      //console.log('Vérification manuelle :', this.newRegistration.level);
      // Met à jour la dernière valeur
      this.lastSelectedLevel = this.newRegistration.level;
      const level = this.newRegistration.level.toLowerCase().includes('l')
        ? 'LICENCE'
        : this.newRegistration.level.toLowerCase().includes('m')
          ? 'MASTER'
          : '';
      // console.log('level', level);
      //console.log('this.specialities', this.specialities);
      this.specialities = this.allSpecialities.filter(
        (s) => s.cycle?.toLowerCase() === level.toLowerCase()
      );
    }

  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.loadRegistrations();
      },
      error: (err) => {
        this.toastr.error(`Erreur de chargement de la liste des étudiants`);
      },
    });
  }

  loadAcademicYears(): void {
    this.academicYearService.getAcademicYears().subscribe({
      next: (academicYear) => {
        this.academicYears = academicYear.filter(ay => ay.status === "EN_COURS");
        // console.log("académique yera", academicYear)
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
        this.allSpecialities = speciality;
      },
      error: (err) => {
        this.toastr.error(`Erreur de chargement des specialités`);
      },
    });
  }

  loadRegistrations(): void {
    this.loading = true;
    // Logic to load registrations from a service
    this.registrationService.getRegistrations().subscribe({
      next: (data) => {
        this.registrations = data;

        //this.filteredRegistrations = data;
        // this.updateFilteredRegistrations;
        this.loading = false;

        this.registrations = this.registrations.map(
          (registration) => {
            const student = this.students.find(
              (s) => s.matricule === registration.matricule
            );
            return {
              ...registration,
              studentFullName: student
                ? `${student.firstName} ${student.lastName}`
                : 'Étudiant inconnu',
            } as Registration;
          });

        this.filteredRegistrations = this.registrations;
        this.updateDisplayedRegistrations();

      },

      error: (err) => {
        this.toastr.error(`Erreur de chargement des inscriptions `);
        this.loading = false;
      },
    });
  }

  viewRegistration(registration: Registration) {
    this.selectedRegistration = registration;
    // this.selectedRegistration = { ...registration };
  }

  updateFilteredRegistrations() {
    // Logic to filter registrations based on filtername
    this.filteredRegistrations = this.filteredRegistrations.filter(
      (registration) =>
        registration.matricule
          .toLowerCase()
          .includes(this.filtername.toLowerCase())
    );
    this.currentPage = 1; // reset sur page 1
    this.updateDisplayedRegistrations();
  }
  updateDisplayedRegistrations(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedRegistrations = this.filteredRegistrations.slice(start, end);
  }

  addRegistration() {
    // Logic to add a new registration
    if (
      this.newRegistration.level &&
      this.newRegistration.specialityLabel &&
      this.newRegistration.matricule &&
      this.newRegistration.academicYearLabel
    ) {
      this.loading = true;
      this.registrationService.addRegistration(this.newRegistration).subscribe({
        next: (data) => {
          this.toastr.success(
            `L'enregistrement ${data.registrationNumber} a été ajouté.`,
            'Succès !'
          );
          this.loading = false;
          // console.log('Enregistrement ajouté avec succès', data);
          this.loadRegistrations(); // Recharger la liste après l'ajout
        },
        error: (err) => {
          this.toastr.error(
            `Erreur lors de l'ajout d'un enregistrement : ${err}`,
            'Erreur !'
          );
          // console.error("Erreur lors de l'ajout d'un enregistrement", err);
          this.loading = false;
        },
      });
      this.resetForm();
    }
  }

  editRegistration(registration: Registration) {
    // Logic to edit an existing registration
    this.editingRegistration = { ...registration };
  }

  chooseRegistration(registration: Registration) {
    this.choosenRegistration = { ...registration };
    this.downloadPdfWithQr(); // Téléchargement du PDF avec QR
  }

  updateRegistration() {
    if (this.editingRegistration) {
      this.loading = true;
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
            this.loading = false;
          },
          error: (err) => {
            this.toastr.error(
              `Erreur lors de la mise à jour de l'enregistrement : ${err}`,
              'Erreur !'
            );
            this.loading = false;
          },
        });
    }
  }

  deleteRegistration(id: number | undefined) {
    let query = confirm(
      'Êtes-vous sûr de vouloir supprimer cette inscription ?'
    );
    if (id !== undefined && query) {
      this.loading = true;
      this.registrationService.deleteRegistration(id).subscribe({
        next: () => {
          this.toastr.success(`L'enregistrement a été supprimé.`, 'Succès !');
          this.loading = false;
          this.loadRegistrations(); // Recharger la liste après la suppression
        },
        error: (err) => {
          this.toastr.error(
            `Erreur lors de la suppression de l'enregistrement : ${err}`,
            'Erreur !'
          );
          this.loading = false;
        },
      });
    }
  }

  saveEditRegistration() { }

  resetForm() {
    this.newRegistration = {
      // registrationNumber: '',
      level: '',
      specialityLabel: '',
      matricule: '',
      academicYearLabel: '',
    };
  }

  downloadPdfWithQr() {
    if (!this.choosenRegistration?.id) {
      this.toastr.warning('Aucune inscription sélectionné.');
      return;
    }

    this.registrationService
      .getRegistrationPdf(this.choosenRegistration?.id)
      .subscribe({
        next: (data) => {
          this.downloadFile(data, 'registration-with-qr.pdf');
        },
        error: (err) => {
          this.toastr.error(
            'Erreur lors du téléchargement du PDF avec QR',
            err
          );
        },
      });
  }

  downloadOriginalPdf() {
    if (!this.selectedRegistration?.id) {
      this.toastr.warning('Aucune inscription sélectionné.');
      return;
    }
    this.registrationService
      .getOriginPdf(this.selectedRegistration?.id)
      .subscribe({
        next: (data) => {
          this.downloadFile(data, 'registration.pdf');
        },
        error: (err) => {
          this.toastr.error(
            'Erreur lors du téléchargement du PDF original',
            err
          );
        },
      });
  }

  private downloadFile(data: ArrayBuffer, filename: string): void {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    // document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    // document.body.removeChild(a);
  }

  // for pagination
  get paginatedRegistrations() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRegistrations.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(value: number): void {
    this.itemsPerPage = value;
    this.currentPage = 1;
  }
}
