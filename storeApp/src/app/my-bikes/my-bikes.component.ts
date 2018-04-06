import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {BikeDataService} from '../bike-data.service'
import {BIKE} from '../bikeClass'
import {USER} from '../userClass'
import {Router} from '@angular/router'
import {address} from '../bikeClass'

@Component({
  selector: 'app-my-bikes',
  templateUrl: './my-bikes.component.html',
  styleUrls: ['./my-bikes.component.css']
})
export class MyBikesComponent implements OnInit {
  address:address=new address("","")
  bike:BIKE= new BIKE("","",0,this.address,null,"","")
  bikesList:BIKE[]
  userData:USER
  errorString:string;
  userID:any;  //this is the session ID, used for authentication
  mapString1:string="https://maps.googleapis.com/maps/api/staticmap?center=";
  mapString2:string="&zoom=10&size=600x300&maptype=roadmap&key=AIzaSyBHIAkveSpcKR-BENVr-W7DTwd54PBdMu0";
  mapStringFull:string="";
  constructor(private _route: ActivatedRoute,
              private _dataService:BikeDataService,
              private _router:Router) {

   	   /*   this._route.paramMap.subscribe( params => {
       	       //console.log(params);
            this.userID=params.get('id')
   	      })
*/
     }

     ngOnInit() {
       this.userID=this._dataService.getSessionUserID().subscribe(
         data=>{console.log(data)
                this.userID=data.sessionUserID
                this.getBikes(this.userID)
              },
         err=>{console.log(err)
            this._router.navigate(['/landing'])
         }
       )

/*      this._dataService.sessionObserver.subscribe(
        data=>{
          console.log(data)
          this.userID=data.sessionUserID
          console.log("this userID is:", this.userID)
        },
        err=>console.log("session data not transmitted")
      )
*/
   } //end ngOnInit

getBikes(id){
   this._dataService.getUserBikes(this.userID).subscribe(
     data=>{console.log(data)
              this.userData=data[0]
              this.bikesList=this.userData.bikesOwned
          },
     err=>console.log("error in code",err)
   )  // this is a better way, compare to teamManager app

    this._dataService.userObserver.subscribe(
      users=>this.userData=users[0],
      err=>console.log(err)
  )
}

   onSubmit(){
     var f = document.getElementById('imagefile')
     var f2 = document.getElementById('imageupload')

     console.log(f2)
    //r = new FileReader();

      this.bike._owner=this.userID;
      this.bike.location=this.address
      this.mapStringFull=`${this.mapString1}${this.bike.location.city},${this.bike.location.state}${this.mapString2}`
      this.bike.mapstring=this.mapStringFull
      console.log(this.bike)
      this._dataService.createBike(this.bike)  //creates bike and pushes to user bikesOwned array
      //reset data fields after submit
      this.address=new address("","")

      this.bike=new BIKE("","",0,this.address,null,"","")
   }

   logOut(){
     this.userID=null
     this._dataService.logOut()
     this._router.navigate(['/landing'])
   }

   onEditSubmit(event,bikeTE){
     console.log(event)
     console.log(bikeTE)
     bikeTE.mapstring=`${this.mapString1}${bikeTE.location.city},${bikeTE.location.state}${this.mapString2}`
     this._dataService.updateBike(bikeTE)
   }

   onDelete(event,bikeTD){
     this._dataService.deleteBike(bikeTD)
   }
}
