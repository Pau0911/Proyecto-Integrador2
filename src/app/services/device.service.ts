import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DevicesService {

  private url = 'http://192.168.43.130:8080';
  date: any;

  constructor(private http: HttpClient) {
  }
  getAllDevices(): Observable<any> {
    return this.http.get(this.url + '/iot/getDeviceNames');
  }

  private devices: any[] = [
    {
      "id": "1234",
      "deviceName": "Dispositivo 0",
      "date": "2020-02-08",
      "img":"assets/img/plano2.png",
      "noiseLevel": 2000,
      "temperature": 23,
      "humidity": 74,
      "lighting": 100,
      "status": "BAJO",
      "class":"div0"
    },
    {
      "id": "12345",
      "deviceName": "Dispositivo 1",
      "img":"assets/img/plano2.png",
      "date": "2020-02-08",
      "noiseLevel": 1000,
      "temperature": 25,
      "humidity": 76,
      "lighting": 178,
      "status": "ALTO",
      "class":"div1"
    },
    {
      "id": "1234",
      "deviceName": "Dispositivo 2",
      "img":"assets/img/plano2.png",
      "date": "2020-02-08",
      "noiseLevel": 1000,
      "temperature": 25,
      "humidity": 76,
      "lighting": 178,
      "status": "ALTO",
      "class":"div2"
    }
  ]
  getDevices() {
    return this.devices
  }
}
