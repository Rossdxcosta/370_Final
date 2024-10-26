export class EscalationRequest {
  ticketId: number;
  previousEmployeeId: string;
  reasonForEscalation: string;
  departmentId: number;
  dateOfEscalation: Date;

  constructor(
    ticketId: number,
    previousEmployeeId: string,
    reasonForEscalation: string,
    departmentId: number,
    dateOfEscalation: Date
  ) {
    this.ticketId = ticketId;
    this.previousEmployeeId = previousEmployeeId;
    this.reasonForEscalation = reasonForEscalation;
    this.departmentId = departmentId;
    this.dateOfEscalation = dateOfEscalation;
  }
}
