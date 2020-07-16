import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ToDoComponent } from './todo.component';
import { ToDoEditComponent } from './todo-edit.component'; 

const routes: Routes = [
    {
        path: '', component: LayoutComponent, 
        children: [ 
            { path: ':id', component: ToDoComponent }, 
            { path: ':id/edit/:item_id', component: ToDoEditComponent }
        ]
    }, 
    { path: '**', redirectTo: ':id', component: ToDoComponent}
]  

@NgModule({
    imports: [RouterModule.forChild(routes)], 
    exports: [RouterModule]
})
export class ToDoRoutingModule { }