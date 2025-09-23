import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // Importer ToastrService

import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from 'src/app/interfaces/course.model';
import { Speciality } from 'src/app/interfaces/speciality.interface';
import { Student } from 'src/app/interfaces/students.model'; // Assurez-vous que le chemin est correct
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { StudentsService } from 'src/app/services/students/students.service';

@Component({
  selector: 'app-gestion-students',
  templateUrl: './gestion-students.component.html',
  styleUrls: ['./gestion-students.component.css'],
})
export class GestionStudentsComponent implements OnInit {
  allStudents: Student[] = [];
  filteredStudents: Student[] = [];
  filtername = '';

  selectedStudent: Student | null = null;
  editingStudent: Student | null = null;

  // NOUVELLES PROPRIÉTÉS pour les listes déroulantes
  allSpecialities: Speciality[] = [];

  // Modèle pour le formulaire d'ajout
  newStudent: Omit<Student, 'id' | 'matricule' | 'speciality' | 'isEnrolled'> =
    {
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
      address: '',
      birthday: null, //Utilisez null pour les champs optionnels qui peuvent être vides.
      // Une chaîne vide "" n'est pas une date valide pour le backend.
      gender: 'MALE',
    };

  // 1. On garde une liste "source" de tous les cours
  /* private allCoursesSource: Course[] = [];

  // 2. On crée une liste spécifique pour l'affichage dans la modale- // On ajoute une propriété 'selected' pour les checkboxes
  coursesForModal: (Course & { selected?: boolean })[] = [];*/

  constructor(
    private studentsService: StudentsService,
    //  Ajout de 'private' pour que coursesService soit une propriété de la classe
    private registrationService: RegistrationService,
    private toastr: ToastrService // Injecter ToastrService
  ) {}

  ngOnInit(): void {
    this.loadStudentsWithSpeciality();
  }
  /**
   * Charge la liste des étudiants et, pour chacun, tente de récupérer sa spécialité
   * via sa dernière inscription.
   */
  loadStudentsWithSpeciality(): void {
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        if (students.length === 0) {
          this.allStudents = [];
          this.updateFilteredStudents();
          return;
        }

        // Pour chaque étudiant, on crée un appel pour récupérer sa dernière inscription
        const registrationRequests = students.map((student) => {
          if (!student.matricule) {
            // Si l'étudiant n'a pas de matricule, on ne peut rien faire. On retourne null.
            return of(null);
          }
          return this.registrationService
            .getLatestRegistrationByMatricule(student.matricule!)
            .pipe(
              catchError((error) => {
                // Si un étudiant n'a pas d'inscription, l'API retourne 404.
                // On intercepte l'erreur et on retourne `null` pour ne pas tout faire planter.
                console.warn(
                  `Pas d'inscription trouvée pour ${student.matricule}`,
                  error
                );
                return of(null);
              })
            );
        });

        // forkJoin exécute tous les appels en parallèle et attend toutes les réponses
        forkJoin(registrationRequests).subscribe((registrations) => {
          // On associe chaque inscription (ou null) à l'étudiant correspondant
          this.allStudents = students.map((student, index) => {
            const registration = registrations[index];
            return {
              ...student,
              isEnrolled: !!registration, // L'étudiant est inscrit si on a trouvé une inscription
              speciality: registration
                ? { label: registration.specialityLabel, description: '' }
                : undefined,
            };
          });
          this.updateFilteredStudents();
        });
      },
      error: (error) =>
        console.error('Erreur lors du chargement des étudiants', error),
    });
  }

  // --- Méthodes de chargement des données ---

  /* loadStudents(): void {
    this.studentsService.getStudents().subscribe({
      next: (data) => {
        this.allStudents = data;
        this.updateFilteredStudents();
      },
      error: (error) =>
        console.error('Erreur lors du chargement des étudiants', error),
    });
  }*/

  // --- Méthodes pour le CRUD ---

  updateFilteredStudents(): void {
    if (!this.filtername) {
      this.filteredStudents = this.allStudents;
      return;
    }
    const filter = this.filtername.toLowerCase();
    this.filteredStudents = this.allStudents.filter(
      (student) =>
        student.firstName.toLowerCase().includes(filter) ||
        student.lastName.toLowerCase().includes(filter)
    );
  }

  addStudent(): void {
    this.studentsService.addStudent(this.newStudent).subscribe({
      next: (createdStudent) => {
        this.toastr.success(
          `L'étudiant ${createdStudent.firstName} ${createdStudent.lastName} a été ajouté.`,
          'Succès !'
        );
        this.loadStudentsWithSpeciality(); // Recharger la liste
        this.resetForm();
      },
      error: (error) =>
        console.error("Erreur lors de l'ajout de l'étudiant", error),
    });
  }

  resetForm(): void {
    this.newStudent = {
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
      address: '',
      birthday: null,
      gender: 'MALE',
    };
  }

  deleteStudent(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      this.studentsService.deleteStudent(id).subscribe({
        next: () => {
          this.toastr.info("L'étudiant a été supprimé.", 'Information');
          this.loadStudentsWithSpeciality();
        },
        error: (error) => console.error('Erreur lors de la suppression', error),
      });
    }
  }

  editStudent(student: Student): void {
    this.editingStudent = { ...student };
  }

  saveEditStudent(): void {
    if (!this.editingStudent || !this.editingStudent.id) return;
    this.studentsService
      .updateStudent(this.editingStudent.id, this.editingStudent)
      .subscribe({
        next: () => {
          this.toastr.success(
            "Les informations de l'étudiant ont été mises à jour.",
            'Succès !'
          );

          this.loadStudentsWithSpeciality;
          this.editingStudent = null; // Important pour fermer la modale
        },
        error: (error) => console.error('Erreur lors de la mise à jour', error),
      });
  }

  viewStudent(student: Student): void {
    this.selectedStudent = student;
  }

  // --- Méthodes pour l'association des cours ---

  // openAssociateCoursesModal(student: Student): void {
  //   this.selectedStudent = student;
  //   // Récupère les IDs des cours déjà associés à cet étudiant
  //   const associatedCourseIds = new Set(
  //     student.courses?.map((course) => course.id)
  //   );
  //   // On construit la liste pour la modale à partir de la liste source
  //   // C'est plus sûr et ça garantit que les données sont à jour
  //   this.coursesForModal = this.allCoursesSource.map((course) => ({
  //     ...course,
  //     // La case est cochée si l'ID du cours est dans la liste des cours de l'étudiant
  //     selected: associatedCourseIds.has(course.id!),
  //   }));
  //   console.log(
  //     'Préparation de la modale avec les cours :',
  //     this.coursesForModal
  //   ); // Pour déboguer
  // }

  // CORRECTION : Ajout de la méthode manquante pour afficher les titres
  /*getCourseTitles(courses: Course[] | undefined): string {
    if (!courses || courses.length === 0) {
      return 'Aucun cours associé';
    }
    return courses.map((course) => course.title).join(', ');
  }*/

  /* associateCourses(): void {
    if (this.selectedStudent && this.selectedStudent.id) {
      // On utilise la liste de la modale pour trouver les cours sélectionnés
      const selectedCourseIds = this.coursesForModal
        .filter((course) => course.selected)
        .map((course) => course.id!);

      this.studentsService
        .associateCoursesToStudent(this.selectedStudent.id, selectedCourseIds)
        .subscribe({
          next: (updatedStudent) => {
            console.log('Cours associés avec succès', updatedStudent);
            this.loadStudents(); // Recharger pour voir les changements
          },
          error: (error) =>
            console.error("Erreur lors de l'association des cours", error),
        });
    }
  }*/
}
