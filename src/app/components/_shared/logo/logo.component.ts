import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.css'
})
export class LogoComponent {
  constructor(private router: Router) {}

  navigateToHome(): void {
    this.router.navigateByUrl('/');
  }
}
