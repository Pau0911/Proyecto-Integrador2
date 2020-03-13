import { Component, OnInit } from '@angular/core';
import {StompService, StompState} from '@stomp/ng2-stompjs';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Message} from '@stomp/stompjs';

@Component({
  selector: 'app-mqtt',
  templateUrl: './mqtt.component.html',
  styleUrls: ['./mqtt.component.css']
})
export class MqttComponent implements OnInit {

  public messages: Observable<Message>;
  public subscribed: boolean;
  private subscription: Subscription;

  constructor(private _stompService: StompService) { }

  ngOnInit() {
    this.subscribed = true;
  }

  public subscribe() {
    
    if (this.subscribed) {
        return;
    }
    this.subscribed = true;
    // Stream of messages
    this.messages = this._stompService.subscribe('/topic/la_cosa');
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
    const body = message.body;
    console.log(body);
  }
}
