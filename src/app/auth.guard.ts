// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // Constructor with dependencie injections
  constructor(private router: Router) {}

  // Function to check if the user is authenticated
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // Get the auth token from local storage
    const token = localStorage.getItem('token');
    // Check if the current route is the /auth route
    const isAuthRoute = state.url.startsWith('/auth');

    // If it is the /auth route and the user is authenticated...
    if (isAuthRoute && token) {
      // Redirect away from /auth
      this.router.navigate(['/']);
      return false;
      // If it is not the /auth route and the user is not authenticated...
    } else if (!isAuthRoute && !token) {
      // Redirect unauthenticated users to /auth
      this.router.navigate(['/auth']);
      return false;
    }

    return true;
  }
}