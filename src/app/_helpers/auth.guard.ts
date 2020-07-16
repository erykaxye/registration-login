import { Injectable } from '@angular/core'; 
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'; 

import { AccountService } from '../_services'; 

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate { 
    constructor(
        private router: Router, 
        private accountService: AccountService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.accountService.currentUserValue;
        if (currentUser) { 
            return true; 
        }

        //else not logged in and redirect to login page 
        this.router.navigate(['/welcome'], { queryParams: { returnUrl: state.url } }); 
        return false; 
    }
}