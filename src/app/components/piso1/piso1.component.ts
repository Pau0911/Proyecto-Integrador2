import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/device.service';

@Component({
  selector: 'app-piso1',
  templateUrl: './piso1.component.html',
  styleUrls: ['./piso1.component.css']
})
export class Piso1Component implements OnInit {

 
  devices:any=[];

  constructor(private _devicesService: DevicesService) { 
  
  }
  ngOnInit() {
    this._devicesService.getAllDevices().subscribe((data:any) =>{
      this.devices=data;
      console.log("Data",data)
      for(let  device of this.devices){
        //recorrer el array
      }
    }); 
    }

  
  getDevice(index:string){
      return this.devices[index]
  }
  
  alert(i:number){
    console.log(i);

  }

}
