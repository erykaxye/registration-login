import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ToDoService, AlertService, AccountService } from '../_services'; 
import { User } from '../_models'; 

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html'
}) //styleUrls: ['./todo.component.css']
export class ToDoComponent implements OnInit {

  toDoForm: FormGroup; 
  checkForm: FormGroup;  
  id: string; //user_id  
  loading = false; 
  submitted = false; 
  loading_check = false; 
  submitted_check = false; 
  list = []; 
  currentUser: User; 
  
  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,  
    private toDoService: ToDoService, 
    private alertService: AlertService, 
    private accountService: AccountService
  ) { 
    this.currentUser = this.accountService.currentUserValue;
  }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id']; 

    //if not logged into correct account 
    if(this.currentUser.id != this.id) { 
      this.router.navigate(['']); 
    }

    this.toDoForm = this.formBuilder.group({
      content: ['', Validators.required], 
      isChecked: false
    }); 

    this.checkForm = this.formBuilder.group({
      content: ['', Validators.required], 
      isChecked: false
    }); 

    this.loadAllItems(); 

  }

  // convenience getter for easy access to form fields
  get f() { return this.toDoForm.controls; }

  get c() { return this.checkForm.controls; }

  onSubmit() {
    this.submitted = true; 

    //reset alerts on submit 
    this.alertService.clear(); 

    if(this.toDoForm.invalid) { return; }

    this.loading = true; 

    //do some action  
    this.toDoService.add(this.toDoForm.value, this.id) 
    .pipe(first())
    .subscribe(
      data => {
        this.alertService.success('Item added successfully', { keepAfterRouteChange: true }); 
        this.toDoForm.reset(); 
        this.submitted = false;
        this.loading = false; 
        this.loadAllItems(); 
      }, 
      error => {
        this.alertService.error(error); 
        this.loading = false; 
      }
    ); 
 
  }

  private loadAllItems() {
    this.toDoService.getAll(this.id)
      .pipe(first())
      .subscribe(
        list => {
          this.list = list; 
          //sort array isChecked false -> true 
          this.list.sort((a,b) => {
            return a.isChecked - b.isChecked; 
          })
        },
        error => {
          this.alertService.error(error); 
        }
      ); 
  }

  check(id: string) {
    console.log("Check function was called with: ", id); 
    this.toDoService.getById(id, this.id)
      .pipe(first())
      .subscribe(
          x => {
          this.c.content.setValue(x.content);
          this.c.isChecked.setValue(!x.isChecked); 
          this.updateItem(id); 
          }
       ); 
  }

  updateItem(id: string) {
    this.submitted_check = true; 

    //reset alerts on submit 
    this.alertService.clear(); 

    if(this.checkForm.invalid) { return; }

    this.loading_check = true; 

    this.toDoService.update(id, this.id, this.checkForm.value)
    .pipe(first())
    .subscribe(
      data => {
        this.alertService.success('Item checked', { keepAfterRouteChange: true }); 
        this.toDoForm.reset(); 
        this.submitted_check = false;
        this.loading_check = false; 
        this.loadAllItems(); 
      }, 
      error => {
        this.alertService.error(error); 
        this.loading = false; 
      }
    ); 
  }

  deleteItem(id: string) {
    const item = this.list.find(x => x.id === id); 
    item.isDeleting = true; 
    this.toDoService.delete(id, this.id)
      .pipe(first())
      .subscribe(() => {
        this.list = this.list.filter(x => x.id !== id)
      }); 
  }

}

/* TODO: 
- still loading even tho nothing on list after deleting user 
 - how to both delete user & list at the same time because it only registers user rn
 - won't matter because you can't access it anyways? 
- jank protection against viewing others lists (route guards)
*/