import { ApiService } from '@/app/services/api.service';
import { AuthService } from '@/app/services/auth.service';
import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @Output() toggleRegistrationEvent = new EventEmitter<void>();

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      this.authService.login(email!, password!).subscribe(
        (response) => {
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    this.loginForm.reset();
  }


  toggleRegistration() {
    this.toggleRegistrationEvent.emit();
  }
}
