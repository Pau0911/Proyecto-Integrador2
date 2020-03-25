import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

//Rutas
import { APP_ROUTING } from './app.routes';
import { HttpClientModule } from '@angular/common/http';

//Servicios
import { DevicesService } from './services/device.service';

//Graficas
import { ChartsModule } from 'ng2-charts';
import { GraficaComponent } from './components/grafica/grafica.component';

//mqtt
import {StompConfig, StompService} from '@stomp/ng2-stompjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//Componentes
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { Piso1Component } from './components/piso1/piso1.component';
import { Piso2Component } from './components/piso2/piso2.component';
import { Piso3Component } from './components/piso3/piso3.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragComponent } from './components/drag/drag.component';
import { DeviceComponent } from './components/device/device.component';
import { MqttComponent } from './components/mqtt/mqtt/mqtt.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

const stompConfig: StompConfig = {
  // Which server?
  url: 'ws://127.0.0.1:15674/ws',
  // Headers
  // Typical keys: login, passcode, host
  headers: {
      login: 'guest',
      passcode: 'guest'
  },
  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 5000,

  // Will log diagnostics on console
  debug: true
};


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    Piso1Component,
    Piso2Component,
    Piso3Component,
    ReporteComponent,
    DragComponent,
    DeviceComponent,
    GraficaComponent,
    MqttComponent,

    
  ],
  imports: [
    BrowserModule,
    APP_ROUTING,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    ChartsModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
  
     }),
     

  ],
  providers: [
    DevicesService,

    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
    


  ],
  bootstrap: [AppComponent,]
  
})
export class AppModule {
  
 }
