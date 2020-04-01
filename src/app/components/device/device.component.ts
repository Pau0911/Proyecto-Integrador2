import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/device.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {

  devices:any={};
  device:any=[];
  id:any;

  constructor(private activatedRoute:ActivatedRoute, private deviceService:DevicesService) { 
    
    this.deviceService.getAllDevices().subscribe((data:any) =>{
      this.devices=data;
      this.activatedRoute.params.subscribe(param => {
        this.id= param['id'];
        console.log("Param",param['id']);
        this.device = this.devices[this.id]
       // console.log("DEVICE",this.device['1'])
        //this.device=this.deviceService.getDevice(this.id);
      });
    
    }); 
  
    
  
  }
  ngOnInit() {
    
  }

  
}