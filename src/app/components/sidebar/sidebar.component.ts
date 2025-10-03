import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.authService.checkAuthentication();
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
