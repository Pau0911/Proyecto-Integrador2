import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css']
})
export class GraficaComponent{

  public lineChartData:Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Ruido' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Temperatura' },
    { data: [18, 48, 77, 9, 100, 27, 40], label: 'Humedad' }
  ];

  public lineChartLabels:Array<any> = ['0', '1', '2', '3', '4', '5', '6'];

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartColors:Array<any> = [];

 public lineChartLegend:boolean = true;
 public lineChartType:string = 'line';

 public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }


}
