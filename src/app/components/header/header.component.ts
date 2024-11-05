//* Module imports
import { Component } from '@angular/core';

//* Component imports
import { LogoComponent } from "@/app/components/_shared/logo/logo.component";
import { SearchComponent } from "@/app/components/_header/search/search.component";
import { UserButtonComponent } from "@/app/components/_header/user-button/user-button.component";
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent, SearchComponent, UserButtonComponent, MatIcon, RouterLink],
  templateUrl: './header.component.html',
})
  
export class HeaderComponent {

  constructor(private router: Router) {}

  navigateToHome(): void {
    this.router.navigateByUrl('/');
  }
}