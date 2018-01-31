import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrowseComponent} from './browse/browse.component'
import {LandingComponent} from './landing/landing.component'
import {MyBikesComponent} from './my-bikes/my-bikes.component'

const routes: Routes = [
  {path:'landing',pathMatch:'full',component:LandingComponent},
  {path:'',pathMatch:'full',redirectTo:'landing'},
  {path:'browse/:id',pathMatch:'full',component:BrowseComponent},
  {path:'mybikes/:id',pathMatch:'full',component:MyBikesComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
