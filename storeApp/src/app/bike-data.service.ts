import { Injectable } from '@angular/core';
import {BIKE} from './bikeClass'
import {USER} from './userClass'
import {Http} from '@angular/http'
import {BehaviorSubject} from 'Rxjs'
import {Observable} from 'Rxjs'
import 'rxjs/add/operator/map'
//import 'rxjs/add/operator/asObservable'

@Injectable()
export class BikeDataService {
  bikeObserver=new BehaviorSubject([])
  userObserver=new BehaviorSubject([])
//  sessionObserver = new BehaviorSubject(null)
  constructor(private _http:Http) { }

  createUser(newUser:USER){
      return this._http.post('/users',newUser)
        .map(response=>response.json())

/*    this._http.post('/users',newUser).subscribe(
      response=>console.log("success"),
      err=>console.log("error in code")
    )
*/

                                    //This is how i used to do it. not as good! -->>            /*.subscribe(response=>this.getUsers(),err=>{console.log(err); return err.json()} )*/
  }

  createBike(newBike:BIKE){
    console.log("service received new bike: ",newBike)
    //return this._http.post('/bikes',newBike).map(response=>response.json())
    this._http.post('/bikes',newBike).subscribe(
        response=>{console.log("success")
        this.updateUserObserver(newBike._owner)
      },
        err=>console.log("error in code")
      )
  }


  getUsers(){
    return this._http.get('/users').map(response=>
      {console.log("get Usersresp: ", response)
        response.json()})
  }

  getBikes(){
    return this._http.get('/bikes').map(response=>response.json())
  }

  loginUser(user:USER){
    return this._http.post('/login',user)
    .map(response=>response.json())
  }

  getUserBikes(userID){   //user id originated from session, authentication needs to be improved with function comparing to http call to server to verify current session
    console.log("getting bikes for: ", userID)
    return this._http.post('/userbikes',{id:userID})
    .map(response=>
      response.json())
  }

  updateBike(bike:BIKE){
    console.log("data service receives update bike: ", bike)
    this._http.post('/updateBike',bike).subscribe(
      data=>this.updateUserObserver(bike._owner),
      err=>console.log(err)
    )
  }

  deleteBike(bike:BIKE){
    console.log("will delete bike: ",bike)
    this._http.post('/deleteBike',bike).subscribe(
      data=>this.updateUserObserver(bike._owner),
      err=>console.log(err)
    )
  }

  updateUserObserver(userID){
    this._http.post('/userbikes',{id:userID}).subscribe(
      userData=>this.userObserver.next(userData.json()),
      err=>console.log(err)
    )
  }

  logOut(){
    console.log("logOut called")
    this._http.get('/logout').subscribe(
      res=>console.log(res),
      err=>console.log("logout error,",err)

    )
    //this.sessionObserver=new BehaviorSubject([])
  }

/*
updateSessionObserver(){
  this._http.get('/getSession').subscribe(
    data=>{
      this.sessionObserver.next(data.json())},
      err=>console.log(err)
  )
}
*/
  getSessionUserID(){
  //  this.updateSessionObserver()
    return  this._http.get('/getSession').map(response=>response.json())
  //    data=>{
      //  let parsedSessionData=JSON.parse(data[0])
      //  console.log(parsedSessionData)
    //    this.sessionObserver.next(data.json())},
    //  err=>console.log(err)
  //  )
  }
}
