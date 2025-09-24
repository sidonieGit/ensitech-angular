import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Course } from 'src/app/interfaces/course.model';
import { Teacher } from 'src/app/interfaces/teachers.model';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { TeachersService } from 'src/app/services/teachers/teachers.service';

@Component({
  selector: 'app-gestion-teachers',
  templateUrl: './gestion-teachers.component.html',
  styleUrls: ['./gestion-teachers.component.css'],
})
export class GestionTeachersComponent implements OnInit {
  allTeachers: Teacher[] = []; // Contient tous les enseignants de l'API
  filteredTeachers: Teacher[] = []; // Contient les enseignants affichés (après filtrage)
  filtername = '';

  // Pour les modals de vue et de modification
  selectedTeacher: Teacher | null = null;
  editingTeacher: Teacher | null = null;

  // Pour le formulaire d'ajout
  newTeacher: Omit<Teacher, 'id' | 'createdAt' | 'courses'> = {
    firstName: '',
    lastName: '',
    email: '',
    // Initialisez les autres champs requis par votre DTO backend
    address: '',
    telephone: '',
    birthday: new Date(), // ou null
    gender: 'MALE', // valeur par défaut
  };
  // --- NOUVELLES PROPRIÉTÉS POUR L'ASSOCIATION DE COURS ---
  // Liste de tous les cours disponibles (pour la modale d'assignation)
  availableCourses: Course[] = [];
  // ID du cours sélectionné dans la modale
  courseToAssignId: number | null = null;

  constructor(
    private teachersService: TeachersService,
    private toastr: ToastrService,
    private coursesService: CoursesService // Injecter CourseService
  ) {}

  ngOnInit(): void {
    this.loadTeachersWithCourses();
    this.loadAllAvailableCourses();
  }

  // --- LOGIQUE DE CHARGEMENT ENRICHIE ---
  loadTeachersWithCourses(): void {
    this.teachersService
      .getTeachers()
      .pipe(
        // switchMap permet d'enchaîner sur un autre Observable
        switchMap((teachers: Teacher[]) => {
          if (!teachers || teachers.length === 0) {
            // Si pas d'enseignants, on termine le flux avec un tableau vide
            return of([]);
          }

          // On prépare un tableau d'appels pour récupérer les cours de chaque enseignant
          const coursesRequests: Observable<Course[]>[] = teachers.map(
            (teacher) =>
              this.coursesService.getCoursesByTeacher(teacher.id).pipe(
                catchError((error) => {
                  console.warn(
                    `Impossible de charger les cours pour l'enseignant ${teacher.id}`,
                    error
                  );
                  // En cas d'erreur pour un enseignant, on retourne un tableau vide
                  // pour ne pas faire échouer tous les autres appels.
                  return of([]);
                })
              )
          );

          // forkJoin exécute tous les appels en parallèle
          return forkJoin(coursesRequests).pipe(
            // map permet de transformer le résultat de forkJoin
            map((coursesPerTeacher: Course[][]) => {
              // Le résultat est un tableau de tableaux de cours (Course[][])
              // On l'utilise pour enrichir chaque enseignant avec sa liste de cours
              return teachers.map((teacher, index) => ({
                ...teacher,
                courses: coursesPerTeacher[index],
              }));
            })
          );
        })
      )
      .subscribe({
        next: (enrichedTeachers: Teacher[]) => {
          // On reçoit ici le tableau final des enseignants enrichis
          this.allTeachers = enrichedTeachers;
          this.updateFilteredTeachers();
        },
        error: (err) => {
          console.error('Une erreur globale est survenue', err);
          this.toastr.error(
            'Une erreur est survenue lors de la récupération des enseignants'
          );
        },
      });
  }

  loadAllAvailableCourses(): void {
    this.coursesService.getCourses().subscribe((courses) => {
      // On garde uniquement les cours qui ne sont pas encore assignés
      this.availableCourses = courses.filter((c) => !c.teacherId);
    });
  }

  // --- LOGIQUE POUR LES ACTIONS DE LA MODALE ---

  openAssignCourseModal(teacher: Teacher): void {
    this.selectedTeacher = teacher;
    this.courseToAssignId = null; // Réinitialiser la sélection
  }

  assignCourseToSelectedTeacher(): void {
    if (!this.selectedTeacher || !this.courseToAssignId) {
      this.toastr.warning(
        'Veuillez sélectionner un enseignant et un cours.',
        'Action requise'
      );
      return;
    }

    this.coursesService
      .assignTeacherToCourse(this.courseToAssignId, this.selectedTeacher.id)
      .subscribe({
        next: () => {
          this.toastr.success(
            `Le cours a été assigné à ${this.selectedTeacher?.firstName}`,
            'Succès !'
          );
          this.loadTeachersWithCourses(); // Recharger toutes les données pour être à jour
          this.loadAllAvailableCourses(); // Rafraîchir la liste des cours non assignés
        },
        error: (err) => {
          this.toastr.error(
            "Erreur lors de l'assignation du cours.",
            'Erreur !'
          );
          console.error(err);
        },
      });
  }

  // Méthode utilitaire pour l'affichage
  getCoursesByTeacher(teacher: Teacher): string {
    if (!teacher.courses || teacher.courses.length === 0) {
      return 'Aucun cours assigné';
    }
    return teacher.courses.map((c) => c.title).join(', ');
  }

  loadTeachers(): void {
    this.teachersService.getTeachers().subscribe(
      (data) => {
        this.allTeachers = data;
        this.updateFilteredTeachers(); // Mettre à jour la liste filtrée
        console.log("Enseignants chargés depuis l'API", this.allTeachers);
      },
      (error) => {
        console.error('Erreur lors du chargement des enseignants', error);
      }
    );
  }

  updateFilteredTeachers(): void {
    if (!this.filtername) {
      this.filteredTeachers = this.allTeachers;
    } else {
      const filter = this.filtername.toLowerCase();
      this.filteredTeachers = this.allTeachers.filter(
        (teacher) =>
          teacher.firstName.toLowerCase().includes(filter) ||
          teacher.lastName.toLowerCase().includes(filter)
      );
    }
  }

  addTeacher(): void {
    // Validation simple
    if (!this.newTeacher.firstName || !this.newTeacher.lastName) {
      this.toastr.error('Le nom et le prénom sont requis.', 'Erreur !');
      return;
    }

    this.teachersService.addTeacher(this.newTeacher).subscribe({
      next: () => {
        this.toastr.success(
          `L'enseignant ${this.newTeacher.firstName} ${this.newTeacher.lastName} a été ajouté.`,
          'Succès !'
        );
        this.loadTeachers(); // Recharger la liste pour voir le nouvel ajout
        // Réinitialiser le formulaire
        this.newTeacher = {
          firstName: '',
          lastName: '',
          email: '',
          address: '',
          telephone: '',
          birthday: new Date(),
          gender: 'MALE',
        };
        // Fermer la modal (manuellement si besoin, Bootstrap devrait le faire avec data-bs-dismiss)
      },
      error: (error) => {
        console.error("Erreur lors de l'ajout", error);
        this.toastr.error("Erreur lors de l'ajout de l'enseignant", 'Erreur !');
      },
    });
  }

  deleteTeacher(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      this.teachersService.deleteTeacher(id).subscribe({
        next: () => {
          this.toastr.info("L'enseignant a été supprimé.", 'Information');
          this.loadTeachers(); // Recharger la liste
        },
        error: (error) => console.error('Erreur lors de la suppression', error),
      });
    }
  }

  // Pour le bouton "Modifier" : prépare la modal
  editTeacher(teacher: Teacher): void {
    // On crée une copie pour ne pas modifier la liste directement
    this.editingTeacher = { ...teacher };
  }

  saveEditTeacher(): void {
    if (!this.editingTeacher) return;

    this.teachersService.updateTeacher(this.editingTeacher).subscribe(
      () => {
        this.toastr.success(
          "Les informations de l'enseignant ont été mises à jour.",
          'Succès !'
        );
        this.loadTeachers();
        this.editingTeacher = null; // Cacher le formulaire de la modal
      },
      (error) => console.error('Erreur lors de la mise à jour', error)
    );
  }

  // Pour le bouton "Voir les informations"
  viewTeacher(teacher: Teacher): void {
    this.selectedTeacher = teacher;
  }
}
