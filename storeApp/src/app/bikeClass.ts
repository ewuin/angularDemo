export class address{
  constructor(
  public  city:string,
  public  state:string
  ){}
  }

export class BIKE{
  constructor(
    public title:string,
    public description:string,
    public price:number,
    public location:address,
    public image:any,
    public _owner:string
  ){}
}
