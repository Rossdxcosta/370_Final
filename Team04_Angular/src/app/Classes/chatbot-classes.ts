export class request{
    type = '';
    payload = '';
}

export class UserConnection {
    userID: string = '';
    room: string = '';
}

export class messageOBJ {
    sender: string = '';
    message: string = '';
    role: number = 0;
    time: Date  = new Date;
}

export class messageDTO {
    chatbotLogID: string = '';
    message: messageOBJDTO = new messageOBJDTO();
    username: string = '';
    role: number = 0;
}

export class messageOBJDTO{
    messageType: number = 0;
    senderID: string = ''; 
    messageText: string = '';
    name: string = '';
    role: number = 0;
    time: Date = new Date();
}