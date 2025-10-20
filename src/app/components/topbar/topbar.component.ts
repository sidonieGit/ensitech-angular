import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AcademicYear } from 'src/app/interfaces/academic.model';
import { AcademicYearService } from 'src/app/services/academic-year/academic-year.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DarkmodeService } from 'src/app/theme/darkmode.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent {
  user: any;
  isDarkMode$!: Observable<boolean>;
  academicYear: AcademicYear[] = [];

  // Récupérer l'utilisateur actuellement connecté
  constructor(
    private authService: AuthService,
    private darkmodeService: DarkmodeService,
    private academicYearService: AcademicYearService
  ) {
    this.user = this.authService.getUser(); // Récupérer l'utilisateur lors de l'initialisation
    this.isDarkMode$ = this.darkmodeService.isDarkMode$;
    this.loadAcademicYear();

  }

  loadAcademicYear(): void {
    this.academicYearService.getAcademicYears().subscribe({
      next: (academicYear) => {
        this.academicYear = academicYear;
        // this.academicYear = academicYear.filter(year => year.status === 'EN_COURS');
        console.log(this.academicYear);
      },
      error: (err) => {
        console.error(`Erreur de chargement de l'année académique`);
      },
    })
  }
  get currentUser() {
    return this.user ? this.user.username : 'Invité';
  }

  get currentRole() {
    //return this.user ? this.user.role : 'Aucun rôle';
    return this.user ? this.user.fonction : '';
  }
  onToggleTheme(): void {
    this.darkmodeService.toggleDarkMode();
  }
}
