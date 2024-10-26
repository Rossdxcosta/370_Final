import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../../../Services/Chatbot/chatbot.service';
import { ChatbotLog } from '../../../Classes/chatbot_log';
import { Router } from '@angular/router';
import { User } from '../../../Classes/users-classes';
import { UserServiceService } from '../../../Services/Users/user-service.service';

@Component({
  selector: 'app-open-chats',
  templateUrl: './open-chats.component.html',
  styleUrl: './open-chats.component.scss'
})
export class OpenChatsComponent implements OnInit{

  isLoading: boolean = true;
  usernames: string[] = [];
  users: User[] = [];

  OpenChats!: ChatbotLog[]
  constructor(public chatbotService: ChatbotService, private route: Router, private userService: UserServiceService){

  }

  ngOnInit(): void {
    this.chatbotService.GetChats().subscribe(chats => {
      this.OpenChats = chats;
      console.log('Received chats:', chats);
      this.isLoading = false;
      for (let i = 0; i < chats.length; i++) {
        for (let b = 0; b < this.users.length; b++) {
          if (chats[i].client_ID == this.users[b].user_ID) {
            this.usernames.push(this.users[b].user_Name + " " + this.users[b].user_Surname);
          }
        }
      }
    });
    this.LoadUsers();
  }

  LoadUsers(){
    this.userService.GetAllUsers().subscribe(e => {
      this.users = e;
    })
  }

  claimChat(ChatUUID: string){
    this.chatbotService.ClaimChat(ChatUUID).subscribe(res => {
      this.route.navigateByUrl("Chat/"+ChatUUID)
    })
  }

}
