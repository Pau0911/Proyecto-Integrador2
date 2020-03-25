import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/device.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {

  device:any={};
  
  id:any;

  constructor(private activatedRoute:ActivatedRoute, private deviceService:DevicesService) { 
    
    this.activatedRoute.params.subscribe(param => {
      this.id= param['id'];
      console.log(param['id']);
      //this.device=this.deviceService.getDevice(this.id);
      console.log(this.device.deName)
    });
    
  
  }
  ngOnInit() {

      this.deviceService.getAllDevices().subscribe((data:any) =>{
      this.device=data;
      console.log(this.device)

    }); 
  }

  
}
