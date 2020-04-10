import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/device.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _deviceService:DevicesService) { }

  ngOnInit() {
  }

  onclick(message:string){
    this._deviceService.startDevices(message).subscribe(resp =>{
      console.log("Encender",message);
    
    });

    
  }
}
