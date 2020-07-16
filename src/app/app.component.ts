import { Component } from '@angular/core';

import { AccountService } from './_services'; 
import { User } from './_models';  

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  currentUser: User; 

  constructor(private accountService: AccountService) {
    this.accountService.currentUser.subscribe(x => this.currentUser = x); 
  }

  logout() {
    this.accountService.logout();
  }
}
