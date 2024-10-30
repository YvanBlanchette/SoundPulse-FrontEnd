//* Module imports
import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule],
  templateUrl: './user-button.component.html',
})
  
export class UserButtonComponent {
  userAvatar = '@public/assets/images/user.jpg';
}
