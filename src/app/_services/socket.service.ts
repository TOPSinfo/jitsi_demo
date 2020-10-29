import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { SignalData } from 'simple-peer';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SignalService {

  private socket: io.Socket;
  env: any = environment;
  get socketId() {
    return this.socket.id
  }

  constructor(

  ) { }

  connect() {
    // this.socket = io.connect('http://localhost:3000', { transports: ['websocket'], upgrade: false });
    this.socket = io.connect(this.env.serverUrl, {
      transports: ['websocket'],
      upgrade: false,
      'reconnection': true,
      'reconnectionDelay': 500,
      'reconnectionAttempts': 10,
      'forceNew': false
    });

    this.socket.on('reconnect_attempt', () => {
      this.socket.io.opts.transports = ['polling', 'websocket'];
    });
  }

  listen = (channel: string, fn: Function) => {
    this.socket.on(channel, fn);
    // this.socket.off(channel, fn);
  }

  send = (chanel: string, message: SignalMessage) => {
    this.socket.emit<any>(chanel, message);
  }

  getSocket = () => {
    return this.socket;
  }


  /*  onConnect(fn: () => void) {
     this.listen('connect', fn)
   }
 
   requestForJoiningRoom(msg: SignalMessage) {
     this.send('room_join_request', msg)
   }
 
   onRoomParticipants(fn: (participants: Array<string>) => void) {
     this.listen('room_users', fn)
   }
 
   sendOfferSignal(msg: SignalMessage) {
     this.send('offer_signal', msg)
   }
 
   onOffer(fn: (msg: SignalMessage) => void) {
     this.listen('offer', fn)
   }
 
   sendAnswerSignal(msg: SignalMessage) {
     this.send('answer_signal', msg)
   }
 
   onAnswer(fn: (msg: SignalMessage) => void) {
     this.listen('answer', fn)
   }
 
   onRoomLeft(fn: (socketId: string) => void) {
     this.listen('room_left', fn)
   } */
}

export interface SignalMessage {
  calleeId?: string,
  signalData?: SignalData,
  msg?: string,
  roomName?: string,
  message: any,
  connectFlag?: boolean
}
