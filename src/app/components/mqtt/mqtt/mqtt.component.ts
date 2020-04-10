import { Component, OnInit } from '@angular/core';
import {StompService, StompState} from '@stomp/ng2-stompjs';
import {Observable, Subscription} from 'rxjs';
import {Message} from '@stomp/stompjs';
import {ToastrService,IndividualConfig } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Piso1Component } from '../../piso1/piso1.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-mqtt',
  templateUrl: './mqtt.component.html',
  styleUrls: ['./mqtt.component.css']
})
export class MqttComponent implements OnInit {

  public messages: Observable<Message>;
  public subscribed: boolean;
  private subscription: Subscription;
  private message;
  //private options: IndividualConfig;

  constructor(private _stompService: StompService,private toastr: ToastrService, private devicePiso:Piso1Component, private router: Router) {
    // this.options = this.toastr.toastrConfig;
    // this.options.positionClass = 'toast-bottom-full-width';
    // this.options.timeOut = 150000;
    // this.options.progressAnimation='decreasing';
    // this.options.closeButton=true;
    // this.options.toastClass='toast-pink';
    //this.toastr.toastrConfig.positionClass='toast-bottom-full-width';
    this.toastr.toastrConfig.timeOut = 15000000;
    this.toastr.toastrConfig.closeButton=true;
    this.toastr.toastrConfig.progressAnimation='decreasing';
    //this.toastr.toastrConfig.toastClass='ngx-toastr toast-warning paula';
    
   }

  ngOnInit() {
    this.messages = null;
    this.subscribe();
    this.subscribed = true;
    
  }

  public subscribe() { 
    if (this.subscribed) {
        return;
    }
    this.subscribed = true;
    this.messages = this._stompService.subscribe('/topic/paula');
    this.subscription = this.messages.subscribe(this.on_next);

  }

public unsubscribe() {
    if (!this.subscribed) {
      this.message=null;
        return;
    }
  
    this.subscription.unsubscribe();
    this.subscription = null;
    this.messages = null;
    this.subscribed = false;

  }

  public on_next = (message: Message) => {
   
     this.message = message.body;
      this.showSuccess();
     //Swal.fire('Nivel ALTO en:',this.message);
    console.log("mensaje",this.message);
  }

  showSuccess() {
    if(this.message){

      console.log("info",this.toastr.info)

      const toast=this.toastr.warning('Nivel ALTO','Alerta!!!', {
      
      })
      if(this.message){
        toast.onTap.subscribe((action) =>
       
        this.router.navigateByUrl('/device/'+this.message)
        );}
       
      }
      else{
      
        this.toastr.error('En el mensaje','ERROR', {
        })
       
      }
    }
    
  }
