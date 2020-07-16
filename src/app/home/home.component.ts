import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators'; 

import { AccountService } from '../_services'; 
import { User } from '../_models'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
}) //styleUrls: ['./home.component.css']
export class HomeComponent {

  currentUser: User; 
  users = []; 

  constructor(private accountService: AccountService) { 
    this.currentUser = this.accountService.currentUserValue; 
  }

  ngOnInit(): void {
    this.loadAllUsers(); 
  }

  private loadAllUsers() {
    this.accountService.getAll() 
      .pipe(first())
      .subscribe(users => this.users = users); 
  }
}
