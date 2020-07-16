import { Injectable } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http'; 
import { map } from 'rxjs/operators'; 

import { environment } from '../../environments/environment';
import { Item } from '../_models'; 

@Injectable({ providedIn: 'root'})
export class ToDoService { 

    constructor(
        private router: Router, 
        private http: HttpClient
    ) { }

    add(item: Item, id: string) {
        return this.http.post(`${environment.apiUrl}/todo/${id}/add`, item); 
    }

    getAll(id: string) { 
        return this.http.get<Item[]>(`${environment.apiUrl}/todo/${id}`); //Item[]
    }

    getById(item_id: string, id: string) {
        return this.http.get<Item>(`${environment.apiUrl}/todo/${id}/${item_id}`); 
    }

    update(item_id: string, id: string, params) {
        return this.http.put(`${environment.apiUrl}/todo/${id}/edit/${item_id}`, params)
        .pipe(map(x => {
            return x; 
        })); 
    }

    delete(item_id: string, id: string) { 
        return this.http.delete(`${environment.apiUrl}/todo/${id}/${item_id}`)
        .pipe(map(x => {
            return x; 
        })); 
    } 
}