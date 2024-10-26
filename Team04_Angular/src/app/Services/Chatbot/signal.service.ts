import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { BehaviorSubject, Observable } from 'rxjs';
import { messageDTO, messageOBJ, UserConnection } from '../../Classes/chatbot-classes';
import { HttpClient } from '@angular/common/http';
import { ChatbotLog, Message } from '../../Classes/chatbot_log';

@Injectable({
  providedIn: 'root'
})
export class SignalService {

  //private hubConnection: signalR.HubConnection;
  public messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  public list$: Observable<any[]> = this.messages.asObservable();

  //Connection tester
  private isConnected = new BehaviorSubject<boolean>(false);
  isConnected$ = this.isConnected.asObservable();
  get isConnectedCheck(): boolean {
    return this.isConnected.value;
  }

  getList(): Observable<any[]> {
    return this.list$;
  }

  constructor(private http: HttpClient) {
    // this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl('http://localhost:5120/chat')
    //   .withAutomaticReconnect()
    //   .build();
    
    // this.hubConnection.start().catch(err => console.error(err)).then(bruh => {this.isConnected.next(true)});

    // this.hubConnection.on('ReceiveMessage', (senderId: string, message: string) => {
    //   let amessage = new messageOBJ()
    //   amessage.message = message;
    //   amessage.sender = senderId
    //   const currentlist = this.messages.value;
    //   this.messages.next([...currentlist,amessage])
    // });

    // this.hubConnection.on('Send', (senderId: string, message:string, groupID: string, role: number, time: Date) => {
    //   console.log(senderId, message, groupID);
    //   let amessage = new messageOBJ()
    //   amessage.message = message;
    //   amessage.sender = senderId
    //   amessage.role = role
    //   amessage.time = time
    //   const currentlist = this.messages.value;
    //   this.messages.next([...currentlist,amessage])
    // });
  }

  public sendMessage(receiverId: string, message: string) {
    //this.hubConnection.invoke('SendMessage', receiverId, message);
  }



  public joinGroup(usserconection: UserConnection) {
    //this.hubConnection.invoke('JoinGroup', usserconection);
  }

  public sendGroupMessage(groupId: string, message: string, username: string, userRole: number) {
    console.log('hey hey')

    //this.hubConnection.invoke('SendGroupMessage', groupId, message, username, userRole);
  }

  public saveMessage(message: messageDTO): Observable<any> {
    return this.http.post<any>("http://localhost:5120/api/Chat/SendMessage", message)
  }

  public GetMessages(Id: string): Observable<ChatbotLog>{
    this.http.get<ChatbotLog>("http://localhost:5120/api/Chat/GetLog/"+ Id).subscribe(chatslog => {chatslog.chat.messages.map(chat => {
      let amessage = new messageOBJ()
      amessage.message = chat.messageText;
      amessage.role = chat.role;
      amessage.sender = chat.senderID;
      const currentlist = this.messages.value;
      this.messages.next([...currentlist,chat])
    })})
    return this.http.get<ChatbotLog>("http://localhost:5120/api/Chat/GetLog/"+ Id)
  }


  public checkstatus(){
    //return this.hubConnection.state
  }

  public clearChat(){

  }
}
