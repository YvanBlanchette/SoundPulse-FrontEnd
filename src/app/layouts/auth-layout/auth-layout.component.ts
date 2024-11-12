import { Component } from '@angular/core';
import { LoginComponent } from "@/app/components/_auth/login/login.component";
import { RegisterComponent } from "@/app/components/_auth/register/register.component";

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayout {
  isRegisteredUser: boolean = true;

  onToggleRegistration($event: any) {
    this.isRegisteredUser = !this.isRegisteredUser;
  }
}
