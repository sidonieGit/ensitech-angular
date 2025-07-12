import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent {
  user: any;

  // Récupérer l'utilisateur actuellement connecté
  constructor(private authService: AuthService) {
    this.user = this.authService.getUser(); // Récupérer l'utilisateur lors de l'initialisation
  }

  get currentUser() {
    return this.user ? this.user.username : 'Invité';
  }

  get currentRole() {
    return this.user ? this.user.role : 'Aucun rôle';
  }
}
