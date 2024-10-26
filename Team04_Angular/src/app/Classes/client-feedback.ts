export class ClientFeedback {
    client_feedback_ID?: number;
    client_ID: string;
    client_Feedback_Detail: string;
    chatbot_Log_ID: number;
    feedback_Date_Created!: Date; 
    ticket_ID: number;

    constructor(
        client_ID: string,
        client_Feedback_Detail: string,
        chatbot_Log_ID: number,
        feedback_Date_Created: Date,
        ticket_ID: number
    ) {
        this.client_ID = client_ID;
        this.client_Feedback_Detail = client_Feedback_Detail;
        this.chatbot_Log_ID = chatbot_Log_ID;
        this.feedback_Date_Created = feedback_Date_Created;
        this.ticket_ID = ticket_ID;
    }
}
