import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})

export class DevicesService {

  private url = 'https://integrador-iot.herokuapp.com';
  date: any;



  constructor(private http: HttpClient) {
  }
  getAllDevices(): Observable<any> {
    return this.http.get(this.url + '/iot/currentStatus');
  }

  startDevices(message:string){
    return this.http.post(`${this.url}/iot/turnOnDevices?${'message'}`,message);
  }

  sendMessageDevices(message:string){
    return this.http.post(`${this.url}/iot/sendGlobalMessage?${'message='}${message}`,message);
    }

  sendMessageDevice(message:string,deviceName:string){
    return this.http.post(`${this.url}/iot/sendPrivateMessage?${'DeviceName='}${deviceName}&&${'message='}${message}`,message);
    }
  }


