import { Component, OnDestroy, AfterViewInit } from '@angular/core';

//* Component imports
import { LogoComponent } from "@/app/components/_shared/logo/logo.component";

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css'],
})
export class WelcomePageComponent {

}