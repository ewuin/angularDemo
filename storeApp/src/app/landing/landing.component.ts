import { Component, OnInit } from '@angular/core';
import {BikeDataService} from '../bike-data.service'
import {BIKE} from '../bikeClass'
import {USER} from '../userClass'
import {Router} from '@angular/router'


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private _dataService:BikeDataService,
              private _router:Router
  ) { }

  bikesList:BIKE[]
  usersList:USER[]
randomBike:BIKE
  user:USER=new USER("","","","",[])
  loginUser:USER=new USER("","","test2@test.com","TestTest1",[])

  errorString:string;

  ngOnInit() {
    this._dataService.getBikes().subscribe(
      data=>{console.log(data)
               this.bikesList=data
            //   var randomNum = Math.floor(Math.random() * this.bikesList.length-1);
               this.randomBike=this.bikesList[Math.floor(Math.random() * (this.bikesList.length-1))]
           },
      err=>console.log("error in code",err)
    )

/*    this._dataService.bikeObserver.subscribe(
    bikes=>this.bikesList=bikes,
    err=>console.log(err)
  )
*/
  }

  onRegister(){
    this.user.email=this.user.email.toLowerCase() //store emails in lowercase
    console.log(this.user)
    this._dataService.createUser(this.user).subscribe(
      cookie=>{console.log(cookie.userID)
              if (cookie.userID==null||cookie.userID==undefined){this.errorString="login code broken!"
              this._router.navigate(['/landing'])
            }
            else if(cookie.userID){
              console.log("Rerouting to Browse")   //succssful login reroutes to browse/:id
              this._router.navigate(['/browse'])
            }
      },

      err=>{let errObj=JSON.parse(err._body)
            if (errObj.code==11000){ this.errorString="Email already registered!"
                          console.log(this.errorString)}
          }
    )
  }

  onLogin(){
    this.loginUser.email=this.loginUser.email.toLowerCase() //all emails in db should be lowercase
    console.log(this.loginUser)
    this._dataService.loginUser(this.loginUser).subscribe(

      cookie=>{console.log(cookie.userID)
              if (cookie.userID==null||cookie.userID==undefined){this.errorString="login code broken!"
              this._router.navigate(['/landing'])
            }
            else if(cookie.userID){
              console.log("Rerouting to Browse")   //succssful login reroutes to browse/:id
              this._router.navigate(['/browse'])
            }
      },

      err=>{
            console.log("error returned to component: ",err._body)
            if (err._body=="null"){this.errorString="Email or password not correct!"}
             else{this.errorString="Login Unsuccessful"}
                          console.log(this.errorString)
                        }

    )
  }
}
