import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//* Interface imports
import { LoginResponse } from '@/app/interfaces/login-response';

//* Service imports
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Constructor with dependency injection
  constructor(private apiService: ApiService) {
    this.updateToken();
  }

  // Function to update the auth token
  updateToken() {
    this.apiService.updateToken();
  }

  // Function to login into an account
  login(email: string, password: string): Observable<LoginResponse> {
    return this.apiService.login(email, password);
  }

  // Function to register a new account
  register(name: string, email: string, password: string): Observable<LoginResponse> {
    return this.apiService.register(name, email, password);
  }

  // Function to logout from the current account
  logout(): Observable<any> {
    return this.apiService.logout();
  }
}