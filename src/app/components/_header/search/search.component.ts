//* Module imports
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatFormFieldModule, MatIcon, MatInput],
  templateUrl: './search.component.html',
})
  
export class SearchComponent {}
