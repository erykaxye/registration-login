import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router'; 
import { Subscription } from 'rxjs'; 

import { AlertService } from '../_services'; 
import {Alert, AlertType } from '../_models'; 

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html'
}) //styleUrls: ['./alert.component.css']
export class AlertComponent implements OnInit, OnDestroy {

  @Input() id = 'default-alert'; 
  @Input() fade = true; 

  private alertSubscription: Subscription; 
  private routeSubscription: Subscription; 
  alerts: Alert[] = []; 

  constructor(private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {
        //clear alerts when empty alert received 
        if (!alert.message) {
          //filer out alerts without flag and remove the flag on the rest 
          this.alerts = this.alerts.filter(x => x.keepAfterRouteChange); 
          this.alerts.forEach(x => delete x.keepAfterRouteChange); 
          return; 
        }
        //else add alert to array 
        this.alerts.push(alert); 
        //auto close alert if required 
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 3000); 
        }
      }); 
      //cleart alerts on location change 
      this.routeSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.alertService.clear(this.id); 
        }
      }); 
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe(); 
    this.routeSubscription.unsubscribe(); 
  }

  removeAlert(alert: Alert) {
    //check if alert is already removed for autoclose 
    if (!this.alerts.includes(alert)) { return; }

    if(this.fade) {
      //fade out alert 
      this.alerts.find(x => x === alert).fade = true; 

      //remove alert after fade 
      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert); 
      }, 250); 
    }
    else {
      //remove alert 
      this.alerts = this.alerts.filter(x => x !== alert); 
    }
  }

  cssClass(alert: Alert) {
    if (!alert) { return; } 

    const classes = ['alert', 'alert-dismissable', 'mt-4', 'container']; 

    const alertTypeClass = {
      [AlertType.Success]: 'alert alert-success',
      [AlertType.Error]: 'alert alert-danger',
      [AlertType.Info]: 'alert alert-info',
      [AlertType.Warning]: 'alert alert-warning'
    }

    classes.push(alertTypeClass[alert.type]); 
    
    if (alert.fade) {
      classes.push('fade'); 
    } 

    return classes.join(' '); 
  }

}
