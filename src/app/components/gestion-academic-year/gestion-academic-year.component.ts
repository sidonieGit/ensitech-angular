import { Component } from '@angular/core';
import { AcademicYear } from 'src/app/interfaces/academic.model';
import { Period } from 'src/app/interfaces/period.model';
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

  displayedAcademicYears: AcademicYear[] = []; // ✅ données visibles (pagination + filtre)

  currentYearStart: string;

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
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private academicYearService: AcademicYearService) {
    // Initialisation ou chargement des années académiques
    this.loadAcademicYears();

    const today = new Date();
    this.currentYearStart = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
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

  showAcademicPeriod(academicYear: AcademicYear) {
    this.selectedAcademicYear = academicYear;
    return this.selectedAcademicYear?.periods?.forEach(
      (period) => period.entitled
    );
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
          this.getCurrentPeriod(this.newAcademicYear);
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
    this.currentPage = 1; // reset sur page 1
    this.updateDisplayedAcademicYears();
  }

  updateDisplayedAcademicYears(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedAcademicYears = this.filteredAcademicYear.slice(start, end);
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

  delete(id: number | undefined): void {
    let query = confirm(
      'Êtes-vous sûr de vouloir supprimer cette année académique ?'
    );
    if (id && query) {
      this.academicYearService.deleteAcademicYear(id).subscribe({
        next: () => {
          alert('Année académique supprimée avec succès');
          this.loadAcademicYears(); // Recharger la liste après la suppression
          this.resetForm();
        },
        error: (error) =>
          console.error(
            "Erreur lors de la suppression de l'année académique",
            error
          ),
      });
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
    const currentDate = new Date(); // Date actuelle
    if (academicYear.periods && academicYear.periods.length > 0) {
      const currentPeriod = academicYear.periods.find((p) => {
        // Convertir les chaînes en objets Date
        const startedAt = new Date(p.startedAt);
        const endedAt = new Date(p.endedAt);
        // console.log("Start at : "+startedAt);

        // Effectuer la comparaison
        return startedAt <= currentDate && endedAt >= currentDate;
      });

      if (currentPeriod) {
        if (
          currentPeriod.typePeriod === 'INSCRIPTION_PERIOD' ||
          currentPeriod.typePeriod === 'EXAMENS_PERIOD'
        ) {
          academicYear.status = 'EN_COURS';
        }
        return currentPeriod.entitled.toLowerCase();
      }
      // Si aucune période en cours n'est trouvée
      if (academicYear.endDate < currentDate) {
        academicYear.status = 'TERMINEE';
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

  startAcademicYear(id: number | undefined) {
    this.academicYearService.changeAcademicYearStatus(id, 'START').subscribe({
      next: (data) => {
        console.log('Année académique démarrée avec succès :', data);
        this.loadAcademicYears(); // Recharger la liste après le démarrage
      },
      error: (error) =>
        console.error("Erreur lors du démarrage de l'année académique", error),
    });
  }

  finishAcademicYear(id: number | undefined) {
    this.academicYearService
      .changeAcademicYearStatus(id, 'COMPLETE')
      .subscribe({
        next: (data) => {
          
          this.loadAcademicYears();
        },
        error: (error) =>
          console.error(
            "Erreur lors de la terminaison de l'année académique",
            error
          ),
      });
  }

  compareDate(startYear: Date): boolean {
    let startYearDate = new Date(startYear);
    return startYearDate.getFullYear() <= new Date().getFullYear();
  }

  checkInput(label: string) {
    console.log(label);
    if (label) {
      return true;
    }
    return false;
  }

  get paginatedAcademicYears() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAcademicYear.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(value: number): void {
    this.itemsPerPage = value;
    this.currentPage = 1;
  }
}
