export class chatbotMessage{
    type: Number = 0;
    message: String = '';

    constructor(type:Number, message:String){
        this.type = type;
        this.message = message;
    }
}

export class Chat{
    messages: chatbotMessage[] = [];
}