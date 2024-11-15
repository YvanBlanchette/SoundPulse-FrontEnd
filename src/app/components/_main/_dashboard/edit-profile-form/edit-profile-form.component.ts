import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User, UserResponse } from '@/app/interfaces/user';
import { UserService } from '@/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';

// Messages for form validation
const FORM_VALIDATION_MESSAGES = {
  required: 'Ce champ est requis.',
  email: 'L\'adresse Courriel est invalide.',
  minlength: 'Le mot de passe doit contenir au moins 8 caractères.',
  mismatch: 'Les mots de passe ne correspondent pas.',
};


@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.css']
})
  
  
export class EditProfileFormComponent implements OnInit {
  // Public Variables
  @Input() user: User | null = null;
  @Output() isEditMode = new EventEmitter<void>();
  isEditPassword: boolean = false;
  isSubmitting: boolean = false;

  // Constructor with dependency injections
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }


  // Passwords validator
  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const formGroup = control as FormGroup;
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    // If password or confirm password is missing, return null
    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    // Get password and confirm password values
    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    // If passwords don't match, return mismatch error
    return password === confirmPassword ? null : { mismatch: true };
  }


  // Form validation
  EditProfileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    avatar: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  }, {
    validators: [this.passwordMatchValidator]
  });


  // On initialize component
  ngOnInit(): void {
    // Set form values with user data
    if (this.user) {
      this.EditProfileForm.setValue({
        name: this.user.name,
        email: this.user.email,
        avatar: this.user.avatar,
        password: '',
        confirmPassword: '',
      });
    }
  }


  // Toggle edit password mode
  toggleEditPassword() {
    this.isEditPassword = !this.isEditPassword;
  }


  // Get error message
  getErrorMessage(controlName: string, errors: any): string {
    if (errors.required) {
      return FORM_VALIDATION_MESSAGES.required;
    } else if (errors.email) {
      return FORM_VALIDATION_MESSAGES.email;
    } else if (errors.minlength) {
      return FORM_VALIDATION_MESSAGES.minlength;
    } else if (errors.mismatch) {
      return FORM_VALIDATION_MESSAGES.mismatch;
    } else {
      return 'Erreur inconnue';
    }
  }

  
  // Cancel edit
  onCancel() {
    this.isEditMode.emit();
  }


  // Submit form
  onSubmit() {
    // If form is valid and user is defined
    if (this.EditProfileForm.valid && this.user) {
      // Set isSubmitting to true
      this.isSubmitting = true;

      // Get form values
      const userData: User = {
        name: this.EditProfileForm.get('name')?.value ?? '',
        email: this.EditProfileForm.get('email')?.value ?? '',
        avatar: this.EditProfileForm.get('avatar')?.value ?? '',
        password: this.EditProfileForm.get('password')?.value ?? '',
      };
  
      // Update user data
      this.userService.updateUser(userData, this.user).subscribe(
        (updatedUser) => {
          this.cdr.detectChanges();
          this.isSubmitting = false;
          this.user = updatedUser;
          this.isEditMode.emit();
        },
        (error) => {
          console.error('Error updating user:', error);
          this.isSubmitting = false;
        }
      );
    }
  }
}