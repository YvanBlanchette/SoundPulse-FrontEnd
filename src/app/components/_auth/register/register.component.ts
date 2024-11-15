import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';

//* Service imports
import { AuthService } from '@/app/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  @Output() toggleRegistrationEvent = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) { }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const formGroup = control as FormGroup;
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, {
    validators: [this.passwordMatchValidator]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const {name, email, password } = this.registerForm.value;
  
      this.authService.register(name ?? '', email ?? '', password ?? '' ).subscribe(
        (error) => {
          console.error(error);
        }
      );
    }
    this.router.navigate(['/']);
  }

  toggleRegistration() {
    this.toggleRegistrationEvent.emit();
  }
}