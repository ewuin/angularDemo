import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrowseComponent} from './browse/browse.component'
import {LandingComponent} from './landing/landing.component'
import {MyBikesComponent} from './my-bikes/my-bikes.component'
import {NotFoundComponent} from './not-found/not-found.component'

const routes: Routes = [
  {path:'landing',pathMatch:'full',component:LandingComponent},
  {path:'',pathMatch:'full',redirectTo:'landing'},
  {path:'browse',pathMatch:'full',component:BrowseComponent},
  {path:'mybikes',pathMatch:'full',component:MyBikesComponent},
  {path: '**',component: NotFoundComponent,}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
