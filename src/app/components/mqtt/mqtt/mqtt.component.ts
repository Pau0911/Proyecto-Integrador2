import { Component, OnInit } from '@angular/core';
import {StompService, StompState} from '@stomp/ng2-stompjs';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Message} from '@stomp/stompjs';
import { ToastrService,IndividualConfig } from 'ngx-toastr';
import Swal from 'sweetalert2';

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

  constructor(private _stompService: StompService,private toastr: ToastrService) {
    // this.options = this.toastr.toastrConfig;
    // this.options.positionClass = 'toast-bottom-full-width';
    // this.options.timeOut = 150000;
    // this.options.progressAnimation='decreasing';
    // this.options.closeButton=true;
    // this.options.toastClass='toast-pink';
    this.toastr.toastrConfig.positionClass='toast-bottom-full-width';
    this.toastr.toastrConfig.timeOut = 150000;
    this.toastr.toastrConfig.closeButton=true;
    this.toastr.toastrConfig.progressAnimation='decreasing';
    //this.toastr.toastrConfig.toastClass='ngx-toastr toast-warning paula';
    
   }

  ngOnInit() {
    this.subscribe();
    this.subscribed = true;
    
  }

  public subscribe() { 
    if (this.subscribed) {
        return;
    }
    this.subscribed = true;
    // Stream of messages
    this.messages = this._stompService.subscribe('/topic/paula');
    // Subscribe a function to be run on_next message
    this.subscription = this.messages.subscribe(this.on_next);

    
  }

public unsubscribe() {
    if (!this.subscribed) {
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
    //this.toastr["warning"]("Device 1", "Nivel alto en:")
    //this.toastr.success(this.message,'Nivel alto en :')
    // this.options = this.toastr.toastrConfig;
    // this.options.positionClass = 'toast-bottom-full-width';
    // this.options.timeOut = 150000;
    // this.options.progressAnimation='decreasing';
    // this.options.closeButton=true;
    this.toastr.warning('Hello world!', 'Toastr fun!', {
      timeOut: 3000
    });
    
    //this.toastr.warning( this.body,'Nivel alto en :');
    }
  }
