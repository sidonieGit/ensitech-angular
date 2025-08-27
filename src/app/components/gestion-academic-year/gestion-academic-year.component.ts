import { Component } from '@angular/core';
import { AcademicYear } from 'src/app/interfaces/academic.model';
import { Period } from 'src/app/interfaces/period.model';
import { AY } from 'src/app/mocks/mock-academic';
import { AcademicYearService } from 'src/app/services/academic-year/academic-year.service';

@Component({
  selector: 'app-gestion-academic-year',
  templateUrl: './gestion-academic-year.component.html',
  styleUrls: ['./gestion-academic-year.component.css'],
})
export class GestionAcademicYearComponent {
  academicYear: AcademicYear[] = [];
  filtername: string = '';
  selectedAcademicYear: AcademicYear | null = null;
  editingAcademicYear: AcademicYear | null = null;
  filteredAcademicYear: AcademicYear[] = [];
  newAcademicYear: AcademicYear = {
    label: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'EN_PREPARATION',
    periods: [],
  };
  // Objet pour une nouvelle période, pour le formulaire dynamique
  newPeriod: Period = {
    entitled: '',
    typePeriod: 'COURS_PERIOD',
    startedAt: new Date(),
    endedAt: new Date(),
  };
  // Ajoutez cette variable pour la nouvelle période en mode édition
  newPeriodForEdit: any = {
    entitled: '',
    typePeriod: 'INSCRIPTION_PERIOD',
    startedAt: '',
    endedAt: '',
  };

  constructor(private academicYearService: AcademicYearService) {
    // Initialisation ou chargement des années académiques
    this.loadAcademicYears();
  }

  addPeriodToAcademicYear(academicYear?: any): void {
    if (!academicYear) {
      // Logique pour la création (votre code existant)
      if (this.newPeriod && this.newPeriod.entitled) {
        if (!this.newAcademicYear.periods) {
          this.newAcademicYear.periods = [];
        }
        this.newAcademicYear.periods.push({ ...this.newPeriod });
        // Réinitialiser le formulaire pour la nouvelle période
        this.newPeriod = {
          entitled: '',
          typePeriod: 'INSCRIPTION_PERIOD',
          startedAt: new Date(),
          endedAt: new Date(),
        };
      }
    } else {
      // Logique pour l'édition
      // Vous devrez implémenter une logique pour afficher le formulaire d'ajout
      // par exemple en utilisant une variable d'état comme newPeriodForEdit
    }
  }

  addPeriodToAcademicY() {
    if (
      this.newPeriod.entitled &&
      this.newPeriod.startedAt &&
      this.newPeriod.endedAt
    ) {
      // Cloner l'objet pour éviter la référence
      this.newAcademicYear.periods?.push({ ...this.newPeriod });
      // console.log(this.newAcademicYear.periods);

      // Réinitialiser newPeriod pour le prochain ajout
      this.newPeriod = {
        entitled: '',
        typePeriod: 'COURS_PERIOD',
        startedAt: new Date(),
        endedAt: new Date(),
      };
    } else {
      alert('Veuillez remplir tous les champs de la période.');
    }
  }

  // Méthode pour supprimer une période
  removePeriod(index: number, academicYear?: any): void {
    if (!academicYear) {
      // Logique pour la création
      this.newAcademicYear.periods?.splice(index, 1);
    } else {
      // Logique pour l'édition
      academicYear.periods.splice(index, 1);
    }
  }

  loadAcademicYears() {
    // Simuler le chargement des années académiques
    // this.academicYear = AY as AcademicYear[];
    this.filteredAcademicYear = this.academicYear as AcademicYear[];

    this.academicYearService.getAcademicYears().subscribe({
      next: (data) => {
        this.academicYear = data;
        this.filteredAcademicYear = data;
      },
      error: (error) =>
        console.error(
          'Erreur lors du chargement des années académiques',
          error
        ),
    });
  }
  filterAcademicYears() {
    if (this.filtername) {
      this.filteredAcademicYear = this.academicYear.filter((ay) =>
        ay.label.toLowerCase().includes(this.filtername.toLowerCase())
      );
    } else {
      this.filteredAcademicYear = this.academicYear;
    }
  }

  selectAcademicYear(academicYear: AcademicYear) {
    this.selectedAcademicYear = academicYear;
    this.editingAcademicYear = { ...academicYear }; // Créer une copie pour l'édition
  }

  // Méthode de création de l'année académique mise à jour
  addAcademicYear() {
    // Appel de la validation avant la soumission
    if (!this.validateAcademicYear(this.newAcademicYear)) {
      return;
    }

    if (
      this.newAcademicYear.label &&
      this.newAcademicYear.startDate &&
      this.newAcademicYear.endDate
    ) {
      this.academicYearService.addAcademicYear(this.newAcademicYear).subscribe({
        next: () => {
          this.loadAcademicYears();
          this.resetForm();
        },
        error: (error) =>
          console.error("Erreur lors de l'ajout de l'année académique", error),
      });
    }
  }

  updateFilteredAcademicYear() {
    this.filteredAcademicYear = this.academicYear.filter((ay) =>
      ay.label.toLowerCase().includes(this.filtername.toLowerCase())
    );
  }
  updateAcademicYear(): void {
    if (this.editingAcademicYear) {
      // 1. Validation de l'année académique modifiée
      if (!this.validateAcademicYear(this.editingAcademicYear)) {
        return;
      }

      // 2. Appel du service pour mettre à jour l'année académique
      this.academicYearService
        .updateAcademicYear(this.editingAcademicYear)
        .subscribe({
          next: (updatedYear) => {
            // 3. Recharger la liste pour refléter les changements
            console.log(
              'Année académique mise à jour avec succès :',
              updatedYear
            );
            this.loadAcademicYears();
            this.resetForm();
          },
          error: (error) => {
            console.error(
              "Erreur lors de la mise à jour de l'année académique",
              error
            );
          },
        });
    }
  }

  deleteAcademicYear(id: number | undefined) {
    if (id) {
      this.academicYear = this.academicYear.filter((ay) => ay.id !== id);
      this.filterAcademicYears();
    }
  }
  resetForm(): void {
    // ... réinitialisation des autres champs
    this.newAcademicYear = {
      label: '',
      startDate: new Date(),
      endDate: new Date(),
      status: 'EN_PREPARATION',
      periods: [],
    };
    this.newPeriod = {
      entitled: '',
      typePeriod: 'COURS_PERIOD',
      startedAt: new Date(),
      endedAt: new Date(),
    };
  }

  editAcademicYear(academicYear: AcademicYear): void {
    this.editingAcademicYear = { ...academicYear };
    this.newPeriodForEdit = null;
  }

  confirmAddPeriodForEdit(): void {
    if (this.newPeriodForEdit && this.newPeriodForEdit.entitled) {
      if (this.editingAcademicYear && !this.editingAcademicYear.periods) {
        this.editingAcademicYear.periods = [];
      }
      if (this.editingAcademicYear && this.editingAcademicYear.periods) {
        this.editingAcademicYear.periods.push({ ...this.newPeriodForEdit });
      }
      this.newPeriodForEdit = null;
    }
  }

  viewAcademicYear(academicYear: AcademicYear): void {
    this.selectedAcademicYear = academicYear;
  }
  saveEditAcademicYear(): void {}

  getCurrentPeriod(academicYear: AcademicYear): string {
    if (academicYear.periods && academicYear.periods.length > 0) {
      const currentDate = new Date();
      const currentPeriod = academicYear.periods.find(
        (p) => p.startedAt <= currentDate && p.endedAt >= currentDate
      );
      if (currentPeriod) {
        return currentPeriod.entitled.toLowerCase();
      }
    }
    return 'Aucune periode en cours';
  }

  // Méthode de validation pour vérifier le nombre de périodes
  validateAcademicYear(academicYear: AcademicYear): boolean {
    if (academicYear.periods && academicYear.periods.length < 3) {
      alert("Veuillez ajouter au moins 3 périodes à l'année académique.");
      return false;
    }
    return true;
  }


}
