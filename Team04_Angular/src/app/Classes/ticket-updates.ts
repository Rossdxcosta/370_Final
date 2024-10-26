import { User } from "./users-classes";

export class TicketUpdates {
    ticket_Update_ID: number = 0;
    ticket_ID: number = 0;
    ticket_Status_Old_ID: number = 0;
    ticket_Status_New_ID: number = 0;
    dateOfChange: Date = new Date();
    hasBeenDismissed: boolean = false;
    ticket_Description: string = ''; 
    client: User = new User(); 
}
