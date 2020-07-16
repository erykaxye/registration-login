import { Injectable } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http'; 
import { BehaviorSubject, Observable } from 'rxjs'; 
import { map } from 'rxjs/operators'; 

import { environment } from '../../environments/environment';
import { User } from '../_models'; 

@Injectable({ providedIn: 'root'})
export class AccountService { 

    private currentUserSubject: BehaviorSubject<User>; 
    public currentUser: Observable<User>; 

    constructor(
        private router: Router, 
        private http: HttpClient
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser'))); 
        this.currentUser = this.currentUserSubject.asObservable(); 
    }

    public get currentUserValue() {
        return this.currentUserSubject.value; 
    }

    login(username, password) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user); 
                return user; 
            })); 
    }

    logout() {
        localStorage.removeItem('currentUser'); 
        this.currentUserSubject.next(null); 
        this.router.navigate(['/welcome']); 
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user); 
    }

    getAll() { 
        return this.http.get<User[]>(`${environment.apiUrl}/users`); 
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`); 
    }

    update(id: string, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                //update stored user if the logged in user updated their own record 
                if (id == this.currentUserValue.id) {
                    const user = { ...this.currentUserValue, ...params}; 
                    localStorage.setItem('currentUser', JSON.stringify(user)); //user? 

                    //publish updated user to subscribers 
                    this.currentUserSubject.next(user); 
                }
                return x; 
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                //auto logout if the logged in user deleted their own record 
                if (id == this.currentUserValue.id) {
                    this.logout(); 
                }
                return x; 
            })); 
    }

}