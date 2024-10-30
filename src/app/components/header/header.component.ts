//* Module imports
import { Component } from '@angular/core';

//* Component imports
import { LogoComponent } from "@/app/components/_shared/logo/logo.component";
import { SearchComponent } from "@/app/components/_header/search/search.component";
import { UserButtonComponent } from "@/app/components/_header/user-button/user-button.component";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent, SearchComponent, UserButtonComponent, MatIcon],
  templateUrl: './header.component.html',
})
  
export class HeaderComponent {}