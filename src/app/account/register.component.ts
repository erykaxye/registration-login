import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { first } from 'rxjs/operators'; 

import { AccountService, AlertService } from '../_services'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
}) //styleUrls: ['./register.component.css']
export class RegisterComponent implements OnInit {

  registerForm: FormGroup 
  loading = false; 
  submitted = false; 

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute, 
    private accountService: AccountService, 
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required], 
      lastName: ['', Validators.required], 
      username: ['', Validators.required], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    }); 
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true; 

    //reset alerts on submit 
    this.alertService.clear(); 

    //return if form is invalid 
    if (this.registerForm.invalid) { return; }

    this.loading = true; 
    this.accountService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => { 
          this.alertService.success('Registration successful', { keepAfterRouteChange: true }); 
          this.router.navigate(['../login'], { relativeTo: this.route }); 
        }, 
        error => { 
          this.alertService.error(error); 
          this.loading = false; 
        }
      ); 
  }

}
