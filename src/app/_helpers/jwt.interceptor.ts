import { Injectable } from '@angular/core'; 
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 

import { AccountService } from '../_services'; 
import { environment } from '../../environments/environment';

@Injectable() 
export class JwtInterceptor implements HttpInterceptor {
    
    constructor(private accountService: AccountService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if user is logged in and request is to the api url
        const currentUser = this.accountService.currentUserValue; 
        const isLoggedIn = currentUser && currentUser.token; 
        const isApiUrl = request.url.startsWith(environment.apiUrl); 
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            }); 
        }
        return next.handle(request); 
    }
}