import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './_helpers'; 

const accountModule = () => import ('./account/account.module').then(x => x.AccountModule); 
const usersModule = () => import('./users/users.module').then(x => x.UsersModule); 
const toDoModule = () => import('./todo/todo.module').then(x => x.ToDoModule); 

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'welcome', component: WelcomeComponent}, 
  { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] }, 
  { path: 'account', loadChildren: accountModule}, 
  { path: 'todo', loadChildren: toDoModule, canActivate: [AuthGuard]}, 

  //else redirect to home 
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
