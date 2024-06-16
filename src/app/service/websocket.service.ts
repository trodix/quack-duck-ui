import {Injectable} from '@angular/core';
import * as StompJs from '@stomp/stompjs';
import {Client, IMessage, StompHeaders} from '@stomp/stompjs';
import {messageCallbackType} from "@stomp/stompjs/src/types";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient!: Client;
  private connected: boolean = false;
  private destinationCallbackMapping: {destination: string, callback: messageCallbackType}[] = [];

  constructor() {}

  public connect(brokerUrl: string, headers: StompHeaders, destinationCallbackMapping: {destination: string, callback: messageCallbackType}[]) {

    this.destinationCallbackMapping = destinationCallbackMapping;

    this.stompClient = new StompJs.Client({
      brokerURL: brokerUrl,
      connectHeaders: headers,
      debug: (str) => {
        console.log(str);
      },
    });

    this.stompClient.onConnect = this.onConnect.bind(this);
    this.stompClient.onWebSocketError = this.onWebSocketError.bind(this);
    this.stompClient.onStompError = this.onStompError.bind(this);

    this.stompClient.activate();
  }

  public disconnect() {
    if (this.connected) {
      this.stompClient.deactivate();
      this.connected = false;
    }
  }

  private onConnect(frame: any) {
    this.connected = true;
    console.log('Connected: ' + frame);

    this.destinationCallbackMapping.forEach(mapping => {
      this.stompClient.subscribe(mapping.destination, mapping.callback);
    });

  }

  public onWebSocketError(error: any) {
    console.error('Error with websocket', error);
  }

  public onStompError(frame: any) {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  }

}
