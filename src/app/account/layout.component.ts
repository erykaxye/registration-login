import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

import { AccountService } from '../_services'; 

@Component({
  templateUrl: './layout.component.html'
}) //styleUrls: ['./layout.component.css']
export class LayoutComponent {

  constructor(
    private router: Router, 
    private accountSerivce: AccountService
  ) { 
    //redirect to home if already logged in 
    if (this.accountSerivce.currentUserValue) {
      this.router.navigate(['/']); 
    }
  }

}
