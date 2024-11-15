import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  template: '<router-outlet />',
})


export class MainComponent {}