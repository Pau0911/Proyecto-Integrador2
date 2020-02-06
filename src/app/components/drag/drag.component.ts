import { Component, OnInit } from '@angular/core';
import { DevicesService,Device } from '../../services/device.service';
@Component({
  selector: 'app-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.css']
})
export class DragComponent implements OnInit {

  devices:Device[]=[];

  constructor(private _devicesService: DevicesService) { }

  ngOnInit() {
    this.devices=this._devicesService.getDevices()
    for(var v in this.devices){
      console.log("Devices",this.devices[v])
    }
  }

}
