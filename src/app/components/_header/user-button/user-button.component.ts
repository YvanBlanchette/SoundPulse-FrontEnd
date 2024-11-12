//* Module imports
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { UserService } from '@/app/services/user.service';
import { User } from '@/app/interfaces/user';
import { AuthService } from '@/app/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, AsyncPipe],
  templateUrl: './user-button.component.html'
})
  
export class UserButtonComponent {
  user$: Observable<User | null>;
  
  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    this.user$ = this.userService.getUser();
  }
  
  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        // Redirect to login page or refresh the current page
        window.location.reload();
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la déconnexion: ', error);
      }
    );
  }

  navigateToProfile(): void {
    this.router.navigate(['/dashboard']);
  }
}