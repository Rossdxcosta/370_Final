import { AfterContentInit, AfterViewInit, Component, HostBinding, OnInit, signal } from '@angular/core';
import { ChatbotService } from '../../../Services/Chatbot/chatbot.service';
import { messageDTO, messageOBJ, request, UserConnection } from '../../../Classes/chatbot-classes';
import { Chat } from '../../../Classes/messages';
import { chatbotMessage } from '../../../Classes/messages';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { ProfileIconComponent } from '../../Profile/profile-icon/profile-icon.component';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { SignalService } from '../../../Services/Chatbot/signal.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SupaAuthService } from '../../../Services/Supabase/supa-auth.service';
import { User_Account_Deactivate_Request } from '../../../Classes/requests';
import { DeactivationRequestComponent } from '../../User/deactivation-request/deactivation-request.component';
import { LogoutComponent } from '../../logout/logout.component';
import { AuthService } from '../../../Services/Login/auth.service';
import { ChatbotLog, Message } from '../../../Classes/chatbot_log';

@Component({
  selector: 'app-chatbot-landing',
  templateUrl: './chatbot-landing.component.html',
  styleUrl: './chatbot-landing.component.scss',
  standalone: true,
  imports: [ProfileIconComponent, RouterLink, CommonModule]
})
export class ChatbotLandingComponent implements AfterViewInit, OnInit {
  first_message: boolean = false;

  id: any
  roleID: number = 2

  showMenu:boolean = false;

  messages!: Message[];
  newMessage: string = '';

  Name: string = '';
  Room: string = '';

  amessage: messageDTO = new messageDTO()

  connection: UserConnection = new UserConnection()

  Chat: Chat = new Chat;
  chatlog: ChatbotLog[] = [];
  message: chatbotMessage = new chatbotMessage(1, '');
  userMessage: string = '';
  username = '';

  handover: boolean = false

  Request = new request();
  dialog: any;

  userDRequest: User_Account_Deactivate_Request = new User_Account_Deactivate_Request();  

  constructor(private authService: AuthService,private router: Router,private chatService: ChatbotService, private userService: UserServiceService, private signalRService: SignalService, private route: ActivatedRoute, private supabase: SupaAuthService) { }
  list!: Message[]

  //////////////////////////////////////////////////////////////////////////////////// DARKMODE STARTS

  darkMode = signal<boolean>(false);
  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  setDarkMode(){
    this.darkMode.set(!this.darkMode());

    if (this.getDarkMode()) {
      localStorage.setItem('textColor', 'black');
    }
    else{
      localStorage.setItem('textColor', 'white');
    }
    
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

  /////////////////////////////////////////////////////////////////////////////////// DARKMODE ENDS
  

  ngOnInit(): void {
    this.userService.GetUser().subscribe(e => {
      this.username =  e.user_Name + ' ' + e.user_Surname;
    });

    this.LoadChatLog();

    this.connection.room = this.route.snapshot.paramMap.get('id') ?? "notworking";
    this.connection.userID = this.userService.getUserIDFromToken()

    this.signalRService.GetMessages(this.route.snapshot.paramMap.get('id') ?? "notworking").subscribe(a => {
      this.list = a.chat.messages
      this.id = a.chatbot_Log_ID
    });

    // this.signalRService.isConnected$.subscribe(value => {
    //   if (value) {
    //     this.Request.type = 'launch';
    //   }
    // })

    

    
    this.signalRService.GetMessages(this.route.snapshot.paramMap.get('id') ?? "notworking").subscribe(a =>{
      if (!a.isBotHandedOver) {
        this.Request.type = 'launch';
        this.chatService.interact(this.Request, this.id).subscribe((res) => {
          this.amessage.chatbotLogID = this.connection.room;
          this.amessage.message.role = 0;
          this.amessage.message.messageType = 0;
          this.amessage.message.messageText = res[0].payload.message;
          this.amessage.message.senderID = this.connection.userID;
          this.amessage.message.name = "Beemie(AI Assistant)"
          this.amessage.username = "Beemie(AI Assistant)";
          this.signalRService.sendGroupMessage(this.Room, res[0].payload.message, "Beemie(AI Assistant)", 0);
          this.signalRService.saveMessage(this.amessage).subscribe()
          //this.message = new chatbotMessage(0, res[0].payload.message);
          //this.Chat.messages.push(this.message);
          console.log(this.list)
        })

      }
    });

    

    this.darkMode.set(this.getDarkMode());
  }

  showMenuModal(){
    this.showMenu = !this.showMenu;
  }

  LoadChatLog(){
    this.chatlog = []
    this.chatService.getClientLogs().subscribe(e => {
      console.log(e);
      for (let i = 0; i < e.length; i++) {
        if (e[i].client_ID == this.userService.getUserIDFromToken() && !e[i].isDismissed) {
          this.chatlog.push(e[i]);
        }
      }
    })
  }

  loadChat(id: string){
    this.messages = this.chatlog.find(e => e.chatUUID == id)!.chat.messages;
  }

  dismissChat(id: string){
    this.chatService.dismissChat(id).subscribe( e => {
      this.LoadChatLog();
      
    });
  }

  ngAfterViewInit(): void {

  }

  updateUser(){
    this.router.navigateByUrl("Update-User")
  }

  openDialog(request: User_Account_Deactivate_Request): void {
    const dialogRef = this.dialog.open(DeactivationRequestComponent, {
      data: request,
    });

    dialogRef.afterClosed().subscribe((result: User_Account_Deactivate_Request) => {
      console.log('The dialog was closed', result);
      this.requestDeactivation(result)
    });
  }

  requestDeactivation(request: User_Account_Deactivate_Request) {
    if (!this.userService.getUserIDFromToken()) {
      alert('You are not logged in')
    } else {
      
    this.userService.RequestDeactivation(request).subscribe(a => { }, error => {
      console.error(error);
      //this.errorMessage = 'Registration failed.';
    })
    }
  }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.authService.logout();
      }
    });
  }

  closeMenuModal(){
    this.showMenu = false;
  }

  sendToBot() {
    this.Request.type = 'text';
    this.Request.payload = this.userMessage;
    this.chatService.interact(this.Request, this.id).subscribe((res) => {
      console.log(res);
      if (res[res.length - 1].type != "end") {
        console.log(res[res.length - 1].payload.message);
      }

      for (let i = 0; i < res.length; i++) {
        if (res[i].type == "text") {
          //this.message = new chatbotMessage(0, res[i].payload.message);
          //this.Chat.messages.push(this.message);
          this.amessage.chatbotLogID = this.connection.room;
          this.amessage.message.role = 0;
          this.amessage.message.messageType = 0;
          this.amessage.message.messageText = res[i].payload.message;
          this.amessage.message.senderID = this.connection.userID;
          this.amessage.username = this.username;
          this.signalRService.sendGroupMessage(this.Room, res[i].payload.message, this.username, 0);
          this.signalRService.saveMessage(this.amessage).subscribe()


        }

        if (res[i].type == "path") {
          console.log(res[i])
        }

        if (res[i].type == "handover") {
          this.chatService.handoverChat(this.route.snapshot.paramMap.get('id') ?? "notworking").subscribe(a => {
      
          })
          this.handover = true;
        }
      }
    })
  }

  sendMessage() {
    // Assuming you have the receiverId or groupId
    //this.signalRService.sendMessage('receiverId', this.newMessage);
    // Or for group messages:
    //this.message = new chatbotMessage(1, this.userMessage);
    //this.Chat.messages.push(this.message);
    this.sendToBot();
    this.first_message = true;

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
        console.log('Invalid user');
        break;
    }

    this.amessage.chatbotLogID = this.connection.room;
    this.amessage.message.role = 2;
    this.amessage.message.messageType = this.roleID;
    this.amessage.message.messageText = this.userMessage;
    this.amessage.message.senderID = this.connection.userID;
    this.amessage.message.name = this.userService.getUserNameFromToken()
    this.amessage.username = this.userService.getUserNameFromToken();
    //this.signalRService.sendGroupMessage(this.Room, this.userMessage, this.userService.getUserNameFromToken(), 2);
    console.log(this.amessage)
    this.signalRService.saveMessage(this.amessage).subscribe();

    this.userMessage = '';

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
