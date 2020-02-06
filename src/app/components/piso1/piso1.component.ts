import { Component, OnInit } from '@angular/core';
import { DevicesService,Device } from '../../services/device.service';

@Component({
  selector: 'app-piso1',
  templateUrl: './piso1.component.html',
  styleUrls: ['./piso1.component.css']
})
export class Piso1Component implements OnInit {

 
  devices:Device[]=[];

  constructor(private _devicesService: DevicesService) { 
  
  }

  ngOnInit() {
  
   
  }

  alert(i:number){
    console.log(i);

  }

}
