import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//* Environment imports
import { env } from '@/env/environment';

//* Interface imports
import { LoginResponse } from '@/app/interfaces/login-response';
import { User } from '@/app/interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // API URL
  private apiUrl = env.API_URL;

  // Token
  private token: string | null = localStorage.getItem('token');

  // Function to update token
  private updateToken(): void {
    this.token = localStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      }),
    };
  }

  // Http options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    }),
  };

  constructor(private http: HttpClient) {
    this.updateToken();
  }

  // Function to handle errors
  private handleError(error: any) {
    console.error('Authentication Error: ', error);
    return throwError(() => error);
  }

  // Function to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Function to get the current user data
  getUser(): Observable<LoginResponse> {
    const endpoint = 'user';

    return this.http.get<LoginResponse>(`${this.apiUrl}/${endpoint}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Function to update the user data
  updateUser(user: User): Observable<User> {
    const endpoint = 'user';
    return this.http.put<User>(`${this.apiUrl}/${endpoint}`, user, this.httpOptions);
  }

  // Function to login
  login(email: string, password: string): Observable<LoginResponse> {
    const endpoint = 'login';
    const data = { email, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/${endpoint}`, data).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      }),
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        this.updateToken();
      })
    );
  }

  // Function to register
  register(name: string, email: string, password: string): Observable<LoginResponse> {
    const endpoint = 'register';
    const data = { name, email, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError),
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        this.updateToken();
      })
    );
  }

  // Function to logout
  logout(): Observable<any> {
    const endpoint = 'logout';

    return this.http.post(`${this.apiUrl}/${endpoint}`, {}, this.httpOptions).pipe(
      catchError(this.handleError),
      tap((response) => {
        localStorage.removeItem('token');
        this.updateToken();
      })
    );
  }
}