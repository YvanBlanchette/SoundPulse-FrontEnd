// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = localStorage.getItem('token');
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

    // Optional: Verify token validity using API
    // try {
    //   const response = await firstValueFrom(this.apiService.validateToken(token));
    //   if (!response.valid) {
    //     this.router.navigate(['/auth']);
    //     return false;
    //   }
    // } catch (error) {
    //   this.router.navigate(['/auth']);
    //   return false;
    // }

    return true;
  }
}