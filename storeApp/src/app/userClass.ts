import {BIKE} from './bikeClass'

export class USER{
  constructor(
    public firstName:string,
    public lastName:string,
    public email:string,
    public password:string,
    public bikesOwned:BIKE[]
  ){}
}
