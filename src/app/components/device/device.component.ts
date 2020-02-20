import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/device.service';
@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {

  devices:any=[];

  constructor(private _devicesService: DevicesService) { 
  
  }

  ngOnInit() {
  this.devices=this._devicesService.getDevices()
    for(var v in this.devices){
      console.log("Devices",this.devices[v])
    }
  }

  alert(i:number){
    console.log(i);

  }

  
}
