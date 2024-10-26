export class TicketEscalation {
    escalation_ID: number;
    ticket_ID: number;
    previous_Employee_ID: string;
    new_Employee_ID: string | null;
    reasonForEscalation: string;
    date_of_Escalation: Date;
    previousEmployee: {
      user_Name: string;
      user_Surname: string;
    };
    ticket: {
      priority: {
        priority_Name: string;
      };
      tag: {
        tag_Name: string;
      };
      ticket_Description: string;
    };
  
    constructor(
      escalation_ID: number,
      ticket_ID: number,
      previous_Employee_ID: string,
      new_Employee_ID: string | null,
      reasonForEscalation: string,
      date_of_Escalation: Date,
      previousEmployee: { user_Name: string; user_Surname: string },
      ticket: {
        priority: { priority_Name: string };
        tag: { tag_Name: string };
        ticket_Description: string;
      }
    ) {
      this.escalation_ID = escalation_ID;
      this.ticket_ID = ticket_ID;
      this.previous_Employee_ID = previous_Employee_ID;
      this.new_Employee_ID = new_Employee_ID;
      this.reasonForEscalation = reasonForEscalation;
      this.date_of_Escalation = date_of_Escalation;
      this.previousEmployee = previousEmployee;
      this.ticket = ticket;
    }
  }
  