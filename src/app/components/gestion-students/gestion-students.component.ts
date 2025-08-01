import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/interfaces/course.model';
import { Student } from 'src/app/interfaces/students.model'; // Assurez-vous que le chemin est correct
import { CoursesService } from 'src/app/services/courses/courses.service'; // Assurez-vous que le chemin est correct
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

  // Modèle pour le formulaire d'ajout
  newStudent: Omit<Student, 'id' | 'matricule' | 'courses'> = {
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
  private allCoursesSource: Course[] = [];

  // 2. On crée une liste spécifique pour l'affichage dans la modale- // On ajoute une propriété 'selected' pour les checkboxes
  coursesForModal: (Course & { selected?: boolean })[] = [];

  constructor(
    private studentsService: StudentsService,
    //  Ajout de 'private' pour que coursesService soit une propriété de la classe
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }

  // --- Méthodes de chargement des données ---

  loadStudents(): void {
    this.studentsService.getStudents().subscribe({
      next: (data) => {
        this.allStudents = data;
        this.updateFilteredStudents();
      },
      error: (error) =>
        console.error('Erreur lors du chargement des étudiants', error),
    });
  }

  loadCourses(): void {
    // La méthode de service retourne un Observable, il faut s'y abonner
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        // On stocke la liste source une bonne fois pour toutes
        this.allCoursesSource = data;
        console.log('Cours chargés :', this.allCoursesSource); // Pour déboguer
      },
      error: (error) =>
        console.error('Erreur lors du chargement des cours', error),
    });
  }

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
      next: () => {
        this.loadStudents(); // Recharger la liste
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
        next: () => this.loadStudents(),
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
          this.loadStudents();
          this.editingStudent = null; // Important pour fermer la modale
        },
        error: (error) => console.error('Erreur lors de la mise à jour', error),
      });
  }

  viewStudent(student: Student): void {
    this.selectedStudent = student;
  }

  // --- Méthodes pour l'association des cours ---

  openAssociateCoursesModal(student: Student): void {
    this.selectedStudent = student;
    // Récupère les IDs des cours déjà associés à cet étudiant
    const associatedCourseIds = new Set(
      student.courses?.map((course) => course.id)
    );
    // On construit la liste pour la modale à partir de la liste source
    // C'est plus sûr et ça garantit que les données sont à jour
    this.coursesForModal = this.allCoursesSource.map((course) => ({
      ...course,
      // La case est cochée si l'ID du cours est dans la liste des cours de l'étudiant
      selected: associatedCourseIds.has(course.id!),
    }));
    console.log(
      'Préparation de la modale avec les cours :',
      this.coursesForModal
    ); // Pour déboguer
  }

  // CORRECTION : Ajout de la méthode manquante pour afficher les titres
  getCourseTitles(courses: Course[] | undefined): string {
    if (!courses || courses.length === 0) {
      return 'Aucun cours associé';
    }
    return courses.map((course) => course.title).join(', ');
  }

  associateCourses(): void {
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
  }
}
