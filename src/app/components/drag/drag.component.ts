import { Component, OnInit } from '@angular/core';
import { DevicesService} from '../../services/device.service';
@Component({
  selector: 'app-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.css']
})
export class DragComponent implements OnInit {

  devices:any=[];

  constructor(private _devicesService: DevicesService) { }

  ngOnInit() {
    this.devices=this._devicesService.getDevices()
    for(var v in this.devices){
      console.log("Devices",this.devices[v])
    }
    //Traer todos los nombres de dispositivos
    /*this.devices=this._devicesService.getAllDevices().subscribe((data:any) =>{
      this.devices=data;
      console.log("Devices"+data) 
    });
    */
    for(var v in this.devices){
      console.log("Devices",this.devices[v])
    }
  }

}
