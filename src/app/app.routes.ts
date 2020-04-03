import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Piso1Component } from './components/piso1/piso1.component';
import { Piso2Component } from './components/piso2/piso2.component';
import { Piso3Component } from './components/piso3/piso3.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { DeviceComponent } from './components/device/device.component';

//import { moduleOrComponent } from 'path';

const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'piso1', component: Piso1Component },
    { path: 'piso2', component: Piso2Component },
    { path: 'piso3', component: Piso3Component },
    { path: 'device/:id', component: DeviceComponent },
    { path: 'reportes', component: ReporteComponent },
    { path: '**', pathMatch:'full', redirectTo: 'home'}
];

export  const APP_ROUTING = RouterModule.forRoot(APP_ROUTES,{useHash:true});
