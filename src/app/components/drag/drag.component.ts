import { Component, OnInit } from '@angular/core';
import { DevicesService} from '../../services/device.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.css']
})
export class DragComponent implements OnInit {

  devices:any;
  dev:any=[];

  myDevice:string;
  constructor(private _devicesService: DevicesService, private route:Router) { }

  ngOnInit() {
     
    // this.devices=this._devicesService.getDevices()
    // for(var v in this.devices){
    //   console.log("Devices",this.devices[v])
    
    //Traer todos los dispositivos
    this._devicesService.getAllDevices().subscribe((data:any) =>{
      this.devices=data;
      for(let device of this.devices){
        //recorrer el array
      }
      console.log("Devices del servicio",this.devices)
    }); 
    }

    getDevices() {
      return this.devices
    }
    getDevice(index:number){
      return this.devices[index]
    }


  viewDevice(index:number){
    console.log("Index",index)
    this.route.navigate(['/device',index])
  }
  
}
