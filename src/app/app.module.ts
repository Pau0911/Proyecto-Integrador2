import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Rutas
import { APP_ROUTING } from './app.routes';


//Servicios
import { DevicesService } from './services/device.service';


//Componentes
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { Piso1Component } from './components/piso1/piso1.component';
import { Piso2Component } from './components/piso2/piso2.component';
import { Piso3Component } from './components/piso3/piso3.component';
import { ReporteComponent } from './components/reporte/reporte.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    Piso1Component,
    Piso2Component,
    Piso3Component,
    ReporteComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTING,
  ],
  providers: [
    DevicesService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
