import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User, UserResponse } from '@/app/interfaces/user';
import { UserService } from '@/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';


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
  @Input() user: User | null = null;
  @Output() isEditMode = new EventEmitter<void>();

  isEditPassword: boolean = false;
  isSubmitting: boolean = false;


  constructor(private userService: UserService, private cdr: ChangeDetectorRef) { }

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

  EditProfileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    avatar: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  }, {
    validators: [this.passwordMatchValidator]
  });


  ngOnInit(): void {
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


  toggleEditPassword() {
    this.isEditPassword = !this.isEditPassword;
  }

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

  onCancel() {
    this.isEditMode.emit();
  }

  onSubmit() {
    if (this.EditProfileForm.valid && this.user) {
      this.isSubmitting = true;
      const userData: User = {
        name: this.EditProfileForm.get('name')?.value ?? '',
        email: this.EditProfileForm.get('email')?.value ?? '',
        avatar: this.EditProfileForm.get('avatar')?.value ?? '',
        password: this.EditProfileForm.get('password')?.value ?? '',
      };
  
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