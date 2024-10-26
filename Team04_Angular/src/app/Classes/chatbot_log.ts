export class ChatbotLogDto {
  chatbot_Log_ID!: number;
  conversation_Title!: string;
}
export class ChatbotLog {
  chatbot_Log_ID: number = 0;
  conversation_Title: string = "";
  client_ID: string = '';
  conversation_Date: Date = new Date();
  chatUUID: string = '';
  chat: Chat = new Chat();
  isDismissed: boolean = false;
  isBotHandedOver: boolean = false;
}

export class Chat {
  Chat_ID: number = 0
  messages!: Message[]
}
export class Message {
  messageType: number = 0;
  senderID: string = '';
  messageText: string = '';
  name: string = '';
  role: number = 0;
  time: Date = new Date()
}

