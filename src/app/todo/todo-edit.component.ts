import { Component, OnInit } from '@angular/core'; 
import { Router, ActivatedRoute, Params } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ToDoService, AlertService, AccountService } from '../_services'; 
import { User } from '../_models'; 

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.component.html', 
  styleUrls: ['./todo-edit.component.css']
})
export class ToDoEditComponent implements OnInit {

  editForm: FormGroup; 
  id: string; //item_id 
  loading = false; 
  submitted = false; 
  user_id: string; 
  currentUser: User; 
  myParam: string; 

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

    this.id = this.route.snapshot.params['item_id']; 
    this.user_id = this.route.snapshot.params['id']; 
    this.route.queryParams.subscribe(
      params => { let id = params['id']}  
    ); 

    //if not logged into correct account 
    if(this.currentUser.id != this.user_id) { 
      this.router.navigate(['']); 
    }

    this.editForm = this.formBuilder.group({
        content: ['', Validators.required], 
        isChecked: ['']
    }); 

    this.toDoService.getById(this.id, this.user_id)
      .pipe(first())
      .subscribe(
          x => {
          this.f.content.setValue(x.content);
          this.f.isChecked.setValue(x.isChecked); 
          }
       ); 

  }

  // convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }

  onSubmit() {
    this.submitted = true; 

    //reset alerts on submit 
    this.alertService.clear(); 

    if(this.editForm.invalid) { return; }

    this.loading = true; 

    this.toDoService.update(this.id, this.user_id, this.editForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Item updated successfully', { keepAfterRouteChange: true }); 
          this.router.navigate(['/todo', this.user_id]);  //{ relativeTo: this.route }
        }, 
        error => {
          this.alertService.error(error); 
          this.loading = false; 
        }
      );
  }
}

//http://localhost:4200/todo?id=1
//http://localhost:4200/todo;id=1
//routeparams
//