import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { DarkmodeService } from 'src/app/theme/darkmode.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {

  logoSrc = 'assets/images/logo-bleue.svg';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private darmodeService: DarkmodeService
  ) {}

  ngOnInit() {
    this.authService.checkAuthentication();
    this.darmodeService.isDarkMode$.subscribe((isDarkMode) => {
      this.logoSrc = isDarkMode
        ? 'assets/images/logo-white_little_sz.svg'
        : 'assets/images/logo-bleue.svg';
    });
  }

  hasAccess(roles: string[]): boolean {
    const user = this.authService.getUser();
    return user && roles.includes(user.role);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login-page']);
    this.toastr.success('Vous êtes déconnecté', 'Succès');
  }
}
