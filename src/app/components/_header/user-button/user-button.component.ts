import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

//* Component imports
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

//* Interface imports
import { User } from '@/app/interfaces/user';

//* Service imports
import { UserService } from '@/app/services/user.service';
import { AuthService } from '@/app/services/auth.service';
import { RoutingService } from '@/app/services/routing.service';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, AsyncPipe, MatTooltipModule],
  templateUrl: './user-button.component.html'
})
  
export class UserButtonComponent {
  // Observable for the current user
  user$: Observable<User | null>;
  
  // Constructor with dependency injections
  constructor(
    private userService: UserService,
    private authService: AuthService,
    public routingService: RoutingService
  )
  {
    // Get user observable
    this.user$ = this.userService.getUser();
  }
  
  // Method to logout the current user
  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        // Redirect to login page or refresh the current page
        window.location.reload();
      },
      (error) => {
        // Log the error
        console.error('Une erreur s\'est produite lors de la déconnexion: ', error);
      }
    );
  }

}