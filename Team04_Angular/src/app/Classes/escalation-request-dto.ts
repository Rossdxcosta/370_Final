export class EscalationRequestDto {
  escalationId: number;
  ticketId: number;
  previousEmployeeName: string;
  previousEmployeeSurname: string;
  reasonForEscalation: string;
  dateOfEscalation: Date;
  priorityName: string;
  tagName: string;
  ticketDescription: string;
  departmentId: number | null;

  constructor(
    escalationId: number,
    ticketId: number,
    previousEmployeeName: string,
    previousEmployeeSurname: string,
    reasonForEscalation: string,
    dateOfEscalation: Date,
    priorityName: string,
    tagName: string,
    ticketDescription: string,
    departmentId: number | null
  ) {
    this.escalationId = escalationId;
    this.ticketId = ticketId;
    this.previousEmployeeName = previousEmployeeName;
    this.previousEmployeeSurname = previousEmployeeSurname;
    this.reasonForEscalation = reasonForEscalation;
    this.dateOfEscalation = dateOfEscalation;
    this.priorityName = priorityName;
    this.tagName = tagName;
    this.ticketDescription = ticketDescription;
    this.departmentId = departmentId;
  }
}
