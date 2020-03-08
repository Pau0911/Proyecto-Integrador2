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
  dataa:any;
  myDevice:string;
  constructor(private _devicesService: DevicesService, private route:Router) { }

  ngOnInit() {
     
    this.devices=this._devicesService.getDevices()
    for(var v in this.devices){
      console.log("Devices",this.devices[v])
    
/*
    //Traer todos los nombres de dispositivos
    this._devicesService.getAllDevices().subscribe((data:any) =>{
      this.devices=data;
      this.dataa=data;
      for(let  device of this.devices){
        //recorrer el array
      }
      console.log(this.devices)
    }); 
  }*/
  }
}

  viewDevice(index:number){
    this.route.navigate(['/device',index])
  }
  
}
