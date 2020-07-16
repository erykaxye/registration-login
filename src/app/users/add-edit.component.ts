import { Component, OnInit } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services'; 

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html'
}) //styleUrls: ['./add-edit.component.css']
export class AddEditComponent implements OnInit {

  addEditForm: FormGroup; 
  id: string; 
  isAddMode: boolean; 
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
    this.id = this.route.snapshot.params['id']; 
    this.isAddMode = !this.id; 

    //password not required in edit mode 
    const passwordValidators = [Validators.minLength(6)]; 
    if (this.isAddMode) {
      passwordValidators.push(Validators.required); 
    }

    this.addEditForm = this.formBuilder.group({
      firstName: ['', Validators.required], 
      lastName: ['', Validators.required], 
      username: ['', Validators.required], 
      password: ['', passwordValidators]
    }); 

    if (!this.isAddMode) {
      this.accountService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.f.firstName.setValue(x.firstName); 
          this.f.lastName.setValue(x.lastName); 
          this.f.username.setValue(x.username); 
        }); 
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.addEditForm.controls; }

  onSubmit() {
    this.submitted = true; 

    //reset alerts on submit 
    this.alertService.clear(); 

    if(this.addEditForm.invalid) { return; }

    this.loading = true; 
    if(this.isAddMode) {
      this.createUser(); 
    }
    else {
      this.updateUser(); 
    }
  }

  private createUser() {
    this.accountService.register(this.addEditForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('User added successfully', { keepAfterRouteChange: true }); 
          this.router.navigate(['.', { relativeTo: this.route }]); 
        }, 
        error => {
          this.alertService.error(error); 
          this.loading = false; 
        }
      ); 
  }

  private updateUser() {
    this.accountService.update(this.id, this.addEditForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('User updated successfully', { keepAfterRouteChange: true }); 
          this.router.navigate(['..', { relativeTo: this.route }]); 
        }, 
        error => {
          this.alertService.error(error); 
          this.loading = false; 
        }
      ); 
  }
}
