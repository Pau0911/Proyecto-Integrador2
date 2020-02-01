import { Injectable } from '@angular/core';

@Injectable()
export class DevicesService {

    private devices:Device[]=[
        {
          "idDevice": "001",
          "name": "Dispositivo 1",
          "ubicacionName":"Zona lateral",
          "img":"assets/img/plano1.png",
          "alert":"Rojo",
          "state":"Desativado"
        },
        {
          "idDevice": "002",
          "name": "Dispositivo 2",
          "ubicacionName":"Zona superior",
          "img":"assets/img/plano2.png",
          "alert":"verde",
          "state":"Desativado"
        },
        {
          "idDevice": "003",
          "name": "Dispositivo 3",
          "ubicacionName":"Zona inferior",
          "img":"assets/img/plano3.png",
          "alert":"Rojo",
          "state":"Activado"
        },
        {
          "idDevice": "004",
          "name": "Dispositivo 4",
          "ubicacionName":"Zona lateral-izquierda",
          "img":"assets/img/plano4.png",
          "alert":"Rojo",
          "state":"Desativado"
        },
        {
          "idDevice": "005",
          "name": "Dispositivo 5",
          "ubicacionName":" lateral-derecha",
          "img":"assets/img/plano5.png",
          "alert":"Rojo",
          "state":"Activado"
        },
        {
          "idDevice": "006",
          "name": "Dispositivo 6",
          "ubicacionName":"Zona lateral",
          "img":"assets/img/plano6.png",
          "alert":"Rojo",
          "state":"Activado"
        },
        {
          "idDevice": "007",
          "name": "Dispositivo 7",
          "ubicacionName":"Zona inferior-izquierda",
          "img":"assets/img/plano7.png",
          "alert":"Verde",
          "state":"Activado"
        },
        {
          "idDevice": "008",
          "name": "Dispositivo 8",
          "ubicacionName":"Zona inferior-derecha",
          "img":"assets/img/plano8.png",
          "alert":"Verde",
          "state":"Activo"
        }
      ]
    
    constructor(){
        console.log("Servicio listo");
    }


    getDevices(){

        return this.devices
      }
    
}
 export interface Device{
    "idDevice": string,
    "name":string,
    "ubicacionName":string,
    "img":string,
    "alert":string,
    "state":string
}