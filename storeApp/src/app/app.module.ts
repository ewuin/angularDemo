import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppRoutingModule} from './app-routing.module'
import {FormsModule} from '@angular/forms'
import {HttpModule} from '@angular/http'

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { BrowseComponent } from './browse/browse.component';
import { MyBikesComponent } from './my-bikes/my-bikes.component';

import {BikeDataService} from './bike-data.service';
import { NotFoundComponent } from './not-found/not-found.component'
import {ngFileUpload} from 'ng-file-upload'

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    BrowseComponent,
    MyBikesComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    ngFileUpload
  ],
  providers: [BikeDataService],// {provide: LAZY_MAPS_API_CONFIG, useClass: GoogleMapsConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
