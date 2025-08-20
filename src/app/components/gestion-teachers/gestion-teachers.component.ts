import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  // Pour le formulaire d'ajout
  newTeacher: Omit<Teacher, 'id' | 'createdAt'> = {
    firstName: '',
    lastName: '',
    email: '',
    // Initialisez les autres champs requis par votre DTO backend
    address: '',
    telephone: '',
    birthday: new Date(), // ou null
    gender: 'MALE', // valeur par défaut
  };
  // 1. On garde une liste "source" de tous les cours
  private allCoursesSource: Course[] = [];

  // 2. On crée une liste spécifique pour l'affichage dans la modale- // On ajoute une propriété 'selected' pour les checkboxes
  coursesForModal: (Course & { selected?: boolean })[] = [];

  // Pour les modals de vue et de modification
  selectedTeacher: Teacher | null = null;
  editingTeacher: Teacher | null = null;

  filtername = '';

  constructor(
    private teachersService: TeachersService,
    private toastr: ToastrService,
    private coursesService: CoursesService // Injecter CourseService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.loadCourses();
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

  loadCourses(): void {
    // La méthode de service retourne un Observable, il faut s'y abonner
    this.coursesService.getCourses().subscribe(
      (courses) => {
        this.allCoursesSource = courses;
        console.log("Cours chargés depuis l'API", this.allCoursesSource);
      },
      (error) => {
        console.error('Erreur lors du chargement des cours', error);
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
      alert('Le nom et le prénom sont requis.');
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
      error: (error) => console.error("Erreur lors de l'ajout", error),
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
