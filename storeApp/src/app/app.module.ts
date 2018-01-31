import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppRoutingModule} from './app-routing.module'
import {FormsModule} from '@angular/forms'
import {HttpModule} from '@angular/http'

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { BrowseComponent } from './browse/browse.component';
import { MyBikesComponent } from './my-bikes/my-bikes.component';

import {BikeDataService} from './bike-data.service'


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    BrowseComponent,
    MyBikesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [BikeDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
