import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {BikeDataService} from '../bike-data.service'
import {BIKE} from '../bikeClass'
import {USER} from '../userClass'
import {Router} from '@angular/router'



@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  bikesList:BIKE[]
//  usersList:USER[]
  errorString:string;
  userID:string;
  constructor(private _route: ActivatedRoute,
              private _dataService:BikeDataService) {

   	      this._route.paramMap.subscribe( params => {
       	       //console.log(params);
               //console.log(params.get('id'))
              this.userID=params.get('id')
   	      })

     }

     ngOnInit() {
       this._dataService.getBikes().subscribe(
         data=>{console.log(data)
                  this.bikesList=data
              },
         err=>console.log("error in code",err)
       )
  /*   this._dataService.getUsersBikes().subscribe(
       data=>{console.log(data)
                this.usersList=data
            },
       err=>console.log("error in code",err)
     )  // this is a better way, compare to teamManager app
*/
   } //end ngOnInit


}
