import { Component } from '@angular/core';
import { Period } from 'src/app/interfaces/period.model';

@Component({
  selector: 'app-gestion-period',
  templateUrl: './gestion-period.component.html',
  styleUrls: ['./gestion-period.component.css'],
})
export class GestionPeriodComponent {
  period!: Period[];
  filtername = '';
  selectedPeriod: Period | null = null;
  editingPeriod: Period | null = null;
  filteredPeriod: Period[] = [];
  newPeriod: Period = {
    entitled: '',
    startedAt: new Date(),
    endedAt: new Date(),
    typePeriod: 'VACANCES_PERIOD',
  };
  constructor(){
    this.period = [
      {
        id:1,
        entitled:"Periodes des vacances",
        startedAt:new Date(),
        endedAt: new Date(),
        typePeriod:"VACANCES_PERIOD"
      },
      {
        id:2,
        entitled:"Periodes des cours",
        startedAt:new Date(),
        endedAt: new Date(),
        typePeriod:"COURS_PERIOD"
      }
    ]
    this.filteredPeriod = this.period as Period[];
  }

  filterPeriods() {
        if (this.filtername) {
          this.filteredPeriod = this.period.filter((ay) =>
            ay.entitled.toLowerCase().includes(this.filtername.toLowerCase())
          );
        } else {
          this.filteredPeriod = this.period;
        }
      }

      selectPeriod(Period: Period) {
        this.selectedPeriod = Period;
        this.editingPeriod = { ...Period }; // Créer une copie pour l'édition
      }

    addPeriod() {
      if (
        this.newPeriod.entitled &&
        this.newPeriod.startedAt &&
        this.newPeriod.endedAt
      ) {
        // Simuler l'ajout d'une nouvelle année académique
        const newId = this.period.length
          ? Math.max(...this.period.map((ay) => ay.id || 0)) + 1
          : 1;
        this.newPeriod.id = newId;
        this.period.push({ ...this.newPeriod });
        this.resetForm();
        this.filterPeriods();
      }
    }
    updateFilteredPeriod() {
      this.filteredPeriod = this.period.filter((ay) =>
        ay.entitled.toLowerCase().includes(this.filtername.toLowerCase())
      );
    }
    updatePeriod() {
      if (this.editingPeriod) {
        const index = this.period.findIndex(
          (ay) => ay.id === this.editingPeriod?.id
        );
        if (index !== -1) {
          this.period[index] = { ...this.editingPeriod };
          this.resetForm();
          this.filterPeriods();
        }
      }
    }
    deletePeriod(id: number | undefined) {
      if (id) {
        this.period = this.period.filter((ay) => ay.id !== id);
        this.filterPeriods();
      }
    }
    resetForm(): void {
      this.newPeriod = {
        entitled: '',
        startedAt: new Date(),
        endedAt: new Date(),
        typePeriod: 'VACANCES_PERIOD',
      };
      this.editingPeriod = null;
      this.selectedPeriod = null;
    }

    editPeriod(period: Period): void {
      this.editingPeriod = { ...period};
    }

    viewPeriod(period : Period): void {
      this.selectedPeriod = period;
    }
    saveEditPeriod(): void {}

}
