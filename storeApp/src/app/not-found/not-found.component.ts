import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  template: `
  <router-outlet></router-outlet>
    <h2>The subdirectory you entered, {{ location.path() }}, does not exist on this server</h2>
    <a [routerLink]="['/landing']">Home Page</a> 
  `

})
export class NotFoundComponent {
  constructor(public location: Location) {}

}
