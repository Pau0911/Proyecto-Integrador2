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
  myDevice:string;
  constructor(private _devicesService: DevicesService) { }

  ngOnInit() {
    this.devices=this._devicesService.getDevices()
    for(var v in this.devices){
      console.log("Devices",this.devices[v])
    }
    //Traer todos los nombres de dispositivos
    /*
    this._devicesService.getAllDevices().subscribe((data:any) =>{
      this.devices=data;
      this.dataa=data;
      console.log(this.devices)
    }); 
*/
  }

  propiedades:Object={
      background:true
  }
  classdevices(deviceName:any):string{
    this.myDevice =deviceName;
    if(deviceName=='dev0'){
      console.log(deviceName)
        return this.myDevice;
    }
    else{
      console.log(deviceName)
      return this.myDevice;
    }

  }
  
}
