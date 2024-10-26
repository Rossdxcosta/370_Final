import { CommonModule } from '@angular/common';
import { Component, HostBinding, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalService } from '../../../Services/Chatbot/signal.service';
import { messageDTO, messageOBJ, UserConnection } from '../../../Classes/chatbot-classes';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { ProfileIconComponent } from '../../Profile/profile-icon/profile-icon.component';
import { SupaAuthService } from '../../../Services/Supabase/supa-auth.service';
import { Message } from '../../../Classes/chatbot_log';

@Component({
  selector: 'app-employee-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-chat.component.html',
  styleUrl: './employee-chat.component.scss'
})
export class EmployeeChatComponent {
  id: any
  roleID!: number

  messages!: Message[];
  newMessage: string = '';

  username: string = '';

  Name: string = '';
  Room: string = '';

  message: messageDTO = new messageDTO()

  connection: UserConnection = new UserConnection()

  constructor(private signalRService: SignalService, private route: ActivatedRoute, private userService: UserServiceService, private supabase: SupaAuthService) { }
  list!: Message[]

    //////////////////////////////////////////////////////////////////////////////////// DARKMODE STARTS

    darkMode = signal<boolean>(false);

    @HostBinding('class.dark') get mode() {
      return this.darkMode();
    }
  
    setDarkMode(){
      this.darkMode.set(!this.darkMode());
      
      localStorage.setItem('darkMode', this.darkMode.toString());
    }
  
    getDarkMode(){
      console.log(localStorage.getItem('darkMode'));
      if (localStorage.getItem('darkMode') == '[Signal: true]') {
        return true;
      }
      else{
        return false;
      };
    }
  
    //////////////////////////////////////////////////////////////////////////////////// DARKMODE ENDS

  ngOnInit(): void {
    this.darkMode.set(this.getDarkMode());

    this.connection.room = this.route.snapshot.paramMap.get('id') ?? "notworking";
    this.connection.userID = this.userService.getUserIDFromToken();
  
    this.username = this.userService.getUserNameFromToken();
    
    this.signalRService.GetMessages(this.route.snapshot.paramMap.get('id') ?? "notworking").subscribe(a => {this.list = a.chat.messages});

    this.signalRService.isConnected$.subscribe(value => {
      if (value) {
        this.signalRService.joinGroup(this.connection)
      }
    })
  }

  ngAfterViewInit(): void {

    //console.log(this.signalRService.checkstatus())

    this.signalRService.GetMessages(this.connection.room).subscribe()
  }

  joinGroup() {
    this.signalRService.joinGroup(this.connection)
  }


  sendMessage() {
    // Assuming you have the receiverId or groupId
    //this.signalRService.sendMessage('receiverId', this.newMessage);
    // Or for group messages:
    const day = 'Monday';

    switch (this.userService.getUserRoleFromToken()) {
      case "Client":
        this.roleID = 2;
        break;

      case "Employee":
        this.roleID = 3;
        break;

      case "Admin":
        this.roleID = 4;
        break;

      case 'SuperAdmin':
        this.roleID = 5;
        break;

      default:
        console.log(this.userService.getUserRoleFromToken());
        break;
    }

    this.message.chatbotLogID = this.connection.room;

    this.message.message.role = 3;
    this.message.message.messageType = this.roleID;
    this.message.message.messageText = this.newMessage;
    this.message.message.senderID = this.connection.userID;
    this.message.message.name = this.userService.getUserNameFromToken();
    this.message.username = this.userService.getUserNameFromToken();
    this.signalRService.sendGroupMessage(this.Room, this.newMessage, this.userService.getUserNameFromToken(), 3);
    console.log(this.message)
    this.signalRService.saveMessage(this.message).subscribe()

    this.newMessage = '';

  }

  filter= "ChatUUID = eq."+this.route.snapshot.paramMap.get('id')

  channelA = this.supabase.supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      filter: this.filter
    },
    (payload: any) => {
      //this.messages = payload.new.chat.Messages
      console.log(payload.new.chat.Messages)
      this.list = payload.new.chat.Messages}
  )
  .subscribe()

}
