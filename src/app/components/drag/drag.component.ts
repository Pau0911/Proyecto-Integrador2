import { Component, OnInit } from '@angular/core';
import { DevicesService} from '../../services/device.service';
@Component({
  selector: 'app-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.css']
})
export class DragComponent implements OnInit {

  devices:any;
  dev:any=[];
  dataa:any;
  constructor(private _devicesService: DevicesService) { }

  ngOnInit() {
    /*this.devices=this._devicesService.getDevices()
    for(var v in this.devices){
      console.log("Devices",this.devices[v])
    }*/
    //Traer todos los nombres de dispositivos
    
    this._devicesService.getAllDevices().subscribe((data:any) =>{
      this.devices=data;
      this.dataa=data;
      console.log(this.devices)
 
    
    });
    
    this.devices=this._devicesService.getNameDevice(this.dataa[1]).subscribe((dataa:any) =>{
    this.dev=dataa;
      console.log("Devices dentro"+dataa[1]) 
  });

  }
}
