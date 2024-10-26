//=================== interfaces ====================//

export interface SummaryData {
  month: string;
  [key: string]: number | string;
}

export interface AutoTableData {
  cell: { x: number; y: number; width: number; height: number; };
  row: { index: number; };
  section: string;
  table: { body: any[] };
}

export interface AutoTableCallbackData {
  (data: AutoTableData): void;
}

export interface ClientSatisfactionReport {
  ticketID: number;
  clientName: string;
  resolvedBy: string;
  resolutionDate: string;
  clientComments: string;
}

export interface TicketAgingReport {
  ticketID: number;
  title: string;
  creationDate: string;
  assignedEmployee: string;
  priority: string;
  currentStatus: string;
  daysOpen: number;
}

export interface TicketEscalationReport {
  escalationID: number;
  ticketID: number;
  previousEmployee: string;
  newEmployee: string;
  reasonForEscalation: string;
  dateOfEscalation: string; 
}

export interface OpenTicketReport {
  ticketID: number;
  title: string;
  creationDate: string;
  assignedAgent: string;
  priority: string;
}

export interface ClosedTicketReport {
  ticketID: number;
  title: string;
  closureDate: string;
  resolutionTime: string;
  assignedAgent: string;
}

export interface TicketByClientReport {
  ticketID: number;
  title: string;
  status: string;
  assignedAgent: string;
  clientName: string;
}

export interface AgentPerformanceReport {
  agentName: string;
  tickets: TicketDetailsReport[];
  ticketsResolved: number;
  averageResolutionTime: number;
  reslutionTime: string;
}

export interface TicketDetailsReport {
  ticketID: number;
  title: string;
  priority: string;
  dateCreated: string;
  assignedEmployee?: string;
  client: string;
  dateResolved: string;
  resolutionTime: number;
  dateReopened: string;
  breachedDate: string;
  timeBreachedFor: number;
}

export interface TicketStatusSummaryReport {
  status: string;
  tickets: TicketDetailsReport[];
}

export interface TicketByDateRangeReport {
  ticketID: number;
  title: string;
  status: string;
  creationDate: string;
  assignedAgent: string;
}

export interface MonthlyTicketTrendReport {
  month: string;
  created: number;
  resolved: number;
  pending: number;
}

//=================== interfaces ====================//