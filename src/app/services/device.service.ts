import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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


  
}
