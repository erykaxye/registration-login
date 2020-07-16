import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ToDoRoutingModule } from './todo-routing.module';
import { LayoutComponent } from './layout.component';
import { ToDoComponent } from './todo.component';
import { ToDoEditComponent } from './todo-edit.component';

@NgModule({
    imports: [
        CommonModule, 
        ReactiveFormsModule, 
        ToDoRoutingModule,
        FormsModule
    ], 
    declarations: [
        LayoutComponent, 
        ToDoComponent, 
        ToDoEditComponent
    ]
})
export class ToDoModule { }