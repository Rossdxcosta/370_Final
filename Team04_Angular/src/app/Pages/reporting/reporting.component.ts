import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal, HostBinding } from '@angular/core';
import { ReportingService } from '../../Services/Reporting/reporting.service';
import { AgChartOptions, AgCartesianChartOptions, AgBarSeriesOptions, AgBaseCartesianChartOptions, AgCategoryAxisOptions, AgNumberAxisOptions, AgCharts } from 'ag-charts-community';
import { AgChartsModule } from 'ag-charts-angular';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpParams } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserServiceService } from '../../Services/Users/user-service.service';
import { Background } from 'ag-charts-community/dist/types/src/module-support';
import { ChartTheme } from 'ag-charts-community/dist/types/src/integrated-charts-theme';
import { Color } from 'ag-charts-community/dist/types/src/sparklines-util';
import { axisLabelsOverlap } from 'ag-charts-community/dist/types/src/scene/util/labelPlacement';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PdfViewerComponent } from './PDFViewer/pdf-viewer/pdf-viewer.component';
import {
  trigger,
  transition,
  style,
  animate,
  AnimationEvent
} from '@angular/animations';


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => any;
    lastAutoTable: any;
  }
}

import {
  SummaryData,
  ClientSatisfactionReport,
  TicketAgingReport,
  TicketEscalationReport,
  OpenTicketReport,
  ClosedTicketReport,
  TicketByClientReport,
  AgentPerformanceReport,
  TicketDetailsReport,
  TicketStatusSummaryReport,
  TicketByDateRangeReport,
  MonthlyTicketTrendReport,
} from '../../Classes/reportingmodels';
import { ReportOptInComponent } from './report-opt-in/report-opt-in.component';

//========== Charts ===========//
interface ClosedTicket {
  date: string;
  count: number;
}

interface ChartOption {
  label: string;
  value: string;
  options: AgChartOptions;
}

interface TicketsCreatedResolvedOverTimeItem {
  date: string;
  created_Count: number;
  resolved_Count: number;
  created_count?: number; 
  resolved_count?: number; 
}

interface AverageResolutionTimeItem {
  date: string;
  avg_resolution_time: number;
}

interface TicketsCreatedOverTimeItem {
  date: string;
  count: number;
}

interface TicketAssignedToEmployee {
  employee_Name: string;
  count: number;
}
//=================== interfaces ====================//

@Component({
  standalone: true,
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss'],
  imports: [
    AgChartsModule,
    MatCardModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    DatePipe,
    PdfViewerComponent,
    ReportOptInComponent
  ],
  animations: [
    trigger('slideAnimation', [
      transition('void => left', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition('left => void', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
      ]),
      transition('void => right', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition('right => void', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
  providers: [DatePipe]
})
export class ReportingComponent implements OnInit {

  color: string = '';
  pdfSrc: Uint8Array | null = null;
  isLoading: boolean = false;
  pdfData: Uint8Array | null = null;
  currentSection: string = 'generateReport';
  animationDirection: 'left' | 'right' | '' = 'left';
  displayedCharts: any[] = [];
  chartInstances: any[] = [];

  
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef<HTMLDivElement>;

  constructor(private reportingService: ReportingService, private datePipe: DatePipe, private userService: UserServiceService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const liveStatistics = localStorage.getItem('livestatistics');

    if (liveStatistics) {
      this.selectedStatistics = JSON.parse(liveStatistics);
    }
    else{
      localStorage.setItem('livestatistics', '');
    }

    for (let a = 0; a < this.availableStatistics.length; a++) {
      for (let b = 0; b < this.selectedStatistics.length; b++) {
        if (this.selectedStatistics[b].includes(this.availableStatistics[a].value)) {
          this.availableStatistics[a].selected = true;
        }   
      }   
    }

    const charts = localStorage.getItem('charts');

    if (charts != null) {
      this.selectedCharts = JSON.parse(charts);
    }
    else{
      localStorage.setItem('charts', '');
    }

    for (let a = 0; a < this.availableCharts.length; a++) {
      for (let b = 0; b < this.selectedCharts.length; b++) {
        if (this.selectedCharts[b] == this.availableCharts[a].value) {
          this.availableCharts[a].selected = true;
        }   
      }   
    }

    this.loadStatistics();
    this.applyChartSelection();
    this.loadClosedTicketsPastWeek();
    this.loadTicketStatusCounts();
    this.loadInitialChartData();
    this.loadAllChartData();
  }

  onAnimationDone(event: AnimationEvent) {
    // Reset the animation direction once the animation is complete
    this.animationDirection = '';
  }

  ngAfterViewInit() {
    if (this.currentSection === 'selectGraphs') {
      this.createCharts();
    }
  }

  selectSection(section: string) {
    this.currentSection = section;
    if (section === 'selectGraphs') {
      setTimeout(() => this.createCharts(), 0);
    }
  }

  loadInitialChartData() {
    // Load data for all charts
    this.reportingService.getClosedTicketsPastWeek().subscribe(data => {
      this.updateChartData('closedTickets', data);
    });
    this.reportingService.getTicketStatusCounts().subscribe(data => {
      this.updateChartData('ticketStatus', data);
    });
    // ... Load data for other charts similarly
  }

  loadAllChartData() {
    this.loadClosedTicketsPastWeek();
    this.loadTicketStatusCounts();
    this.loadTicketsCreatedResolvedOverTime();
    this.loadAverageResolutionTime();
    this.loadTicketsByPriority();
    this.loadTicketsByTag();
    this.loadTicketsAssignedToEmployees();
    this.loadTicketsByClient();
    this.loadTicketsCreatedOverTime();
  }

  updateChartData(chartType: string, newData: any) {
    const chartIndex = this.availableCharts.findIndex(chart => chart.value === chartType);
    if (chartIndex !== -1) {
      this.availableCharts[chartIndex].options.data = newData;
      if (this.chartInstances[chartIndex]) {
        this.chartInstances[chartIndex].updateData(newData);
      }
    }
  }

  applyChartSelection(): void {
    this.displayedCharts = this.availableCharts.filter(chart => chart.selected);
    const chartdata: string[] = this.displayedCharts.map(chart => chart.value);
    localStorage.setItem('charts', JSON.stringify(chartdata));
    
    // Use setTimeout to ensure DOM is updated before creating charts
    setTimeout(() => {
      this.createCharts();
      this.updateChartsData();
    }, 0);
  }

  createCharts(): void {
    // Destroy existing chart instances
    this.chartInstances.forEach(chart => chart.destroy());
    this.chartInstances = [];
  
    // Create new chart instances
    this.displayedCharts.forEach((chart, index) => {
      const container = document.getElementById(`chart-container-${index}`);
      if (container) {
        const chartInstance = AgCharts.create({
          ...chart.options,
          container: container,
          autoSize: true,
          // Add other common options here
        });
        this.chartInstances.push(chartInstance);
      } else {
        console.warn(`Container for chart ${chart.label} not found`);
      }
    });
  }

  //========================================== Live Statistics ==============================================//

  onToggleChange(stat: any, isChecked: boolean): void {
    if (isChecked) {
      this.selectedStatistics.push(stat.value);
    } else {
      this.selectedStatistics = this.selectedStatistics.filter(val => val !== stat.value);
    }
  }

  onToggleChangeChart(chart: any, isChecked: boolean): void {
    if (isChecked) {
      this.selectedCharts.push(chart.value);
    } else {
      this.selectedCharts = this.selectedCharts.filter(val => val !== chart.value);
    }
  }

  startDateStat2: Date | null = null;
  startTime: string = '00:00:00'; 
  endDateStat2: Date | null = null;
  endTime: string = '23:59:59';

  selectedStatistics: string[] = [];
  displayedStatistics: any[] = [];
   
  formatDate(date: Date | null): string | null {
    return date ? this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss') : null;
  }

  combineDateTime(date: Date | null, time: string): string | null {
    if (!date || !time) return null;
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    return `${formattedDate}T${time}`;
  }
  
  availableStatistics = [
    { label: 'Open Tickets', value: 'openTickets', selected: false },
    { label: 'Closed Tickets', value: 'closedTickets', selected: false },
    { label: 'Breached Tickets', value: 'breachedTickets', selected: false },
    { label: 'Low Priority Tickets', value: 'lowPriorityTickets', selected: false },
    { label: 'Total Tickets Created', value: 'totalTicketsCreated', selected: false },
    { label: 'Average Resolution Time', value: 'averageResolutionTime', selected: false },
    { label: 'Tickets Reopened', value: 'ticketsReopened', selected: false },
    { label: 'Tickets Escalated', value: 'escalatedTicketsLastWeek', selected: false },
  ];

  applyStatisticsSelection(): void {
    this.displayedStatistics = [];

    const formattedStartDate = this.combineDateTime(this.startDateStat2, this.startTime);
    const formattedEndDate = this.combineDateTime(this.endDateStat2, this.endTime)

    this.selectedStatistics.forEach(stat => {
      if (stat === 'openTickets') {
        this.reportingService.getOpenTickets(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            this.displayedStatistics.push({ title: 'Open Tickets', value: data });
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'closedTickets') {
        this.reportingService.getClosedTickets(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            this.displayedStatistics.push({ title: 'Closed Tickets', value: data });
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'breachedTickets') {
        this.reportingService.getBreachedTickets(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            this.displayedStatistics.push({ title: 'Breached Tickets', value: data });
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'lowPriorityTickets') {
        this.reportingService.getLowPriorityTickets(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            this.displayedStatistics.push({ title: 'Low Priority Tickets', value: data });
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'totalTicketsCreated') {
        this.reportingService.getTotalTicketsCreated(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            this.displayedStatistics.push({ title: 'Total Tickets Created', value: data });
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'averageResolutionTime') {
        
        this.reportingService.getAverageResolutionTimeStat(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            if (data && data.length > 0) {
              const avgResolutionTime = data[0].avg_resolution_time_hours;
              this.displayedStatistics.push({ 
                title: 'Average Resolution Time (H)', 
                value: avgResolutionTime.toFixed(2) // Round to 2 decimal places
              });
              console.log('Getting average resolution time: ' + avgResolutionTime.toFixed(2));
            } else {
              console.error('No data received for average resolution time');
            }
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'ticketsReopened') {
        this.reportingService.getTicketsReopened(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            this.displayedStatistics.push({ title: 'Tickets Reopened', value: data });
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'escalatedTicketsLastWeek') {
        this.reportingService.getEscalatedTicketsLastWeek(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            console.log('Received data for escalated tickets:', data);
            let displayValue: string;
            if (data.error) {
              displayValue = `Error: ${data.error}`;
              console.error('Error in escalated tickets data:', data.error);
            } else if (data.count === null) {
              displayValue = 'No data';
            } else {
              displayValue = data.count.toString();
            }
            console.log('Display value for escalated tickets:', displayValue);
            this.displayedStatistics.push({ 
              title: 'Tickets Escalated Last Week', 
              value: displayValue
            });
          },
          error: (error) => {
            console.error('API Error in component:', error);
            this.displayedStatistics.push({ 
              title: 'Tickets Escalated Last Week', 
              value: 'Error: API call failed'
            });
          }
        });
      }
    });

    localStorage.setItem('livestatistics', JSON.stringify(this.selectedStatistics));
  }

  loadStatistics() {
    this.applyStatisticsSelection();
  }
  //========================================== Live Statistics ==============================================//



  //========================================== Reporting ==============================================//
  reportTypes = [
    'Tickets Escalation Report',
    'Client Satisfaction Report',
    'Ticket Aging Report',
    'Open Tickets Report',
    'Closed Tickets Report',
    'Tickets by Client Report',
    'Employee Performance Report',
    'Ticket Status Summary Report',
    'Tickets by Date Range Report',
    'Monthly Ticket Trend Report',
    'Tickets Summary Report',
  ];
  selectedReportType: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  userName: string | null = null;
  maxDate: string = new Date().toISOString().slice(0, 16); 

  FindUser(){
    const userName = this.userService.getUserNameFromToken();
    return userName;
  }
  
  async generatePDFReport() {
    if (!this.selectedReportType) return;
  
    // Check for date selections on specific reports that require them
    if (this.selectedReportType === 'Tickets by Date Range Report') {
      if (!this.startDate || !this.endDate) {
        alert('Please select a start date and end date');
        return;
      }
      const currentDate = new Date();
      const startDate = new Date(this.startDate!);
      const endDate = new Date(this.endDate!);
  
      // Check if the selected dates are in the future
      if (startDate > currentDate || endDate > currentDate) {
        alert('Please select a date and time that is current or in the past');
        return;
      }
    }

    const doc = new jsPDF();
    this.addReportHeader(doc, this.selectedReportType, this.FindUser()); 
    this.addReportDescription(doc, this.selectedReportType);
    
    try {
      switch (this.selectedReportType) {
        case 'Tickets Escalation Report':
          await this.generateTicketEscalationReport(doc);
          break;
        case 'Client Satisfaction Report':
          await this.generateClientSatisfactionReport(doc);
          break;
        case 'Ticket Aging Report':
          await this.generateTicketAgingReport(doc);
          break;
        case 'Open Tickets Report':
          await this.generateOpenTicketsReport(doc);
          break;
        case 'Closed Tickets Report':
          await this.generateClosedTicketsReport(doc);
          break;
        case 'Tickets by Client Report':
          await this.generateTicketsByClientReport(doc);
          break;
        case 'Employee Performance Report':
          await this.generateAgentPerformanceReport(doc);
          break;
        case 'Ticket Status Summary Report':
          await this.generateTicketStatusSummaryReport(doc);
          break;
        case 'Tickets by Date Range Report':
          await this.generateTicketsByDateRangeReport(doc, this.startDate!, this.endDate!); 
          break;
        case 'Monthly Ticket Trend Report':
          await this.generateMonthlyTicketTrendReport(doc);
          break;
        case 'Tickets Summary Report':
          await this.generateTicketsSummaryReport(doc);
          break;
      }
      doc.save(`${this.selectedReportType.replace(/\s+/g, '')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    }
  }
  

  addReportDescription(doc: jsPDF, reportType: string) {
    let description = '';
  
    switch (reportType) {
      case 'Tickets Escalation Report':
        description = 'This report provides a detailed view of tickets that have been escalated to higher support levels, indicating complex or challenging issues. It includes Ticket ID, Original Assigned Employee, Escalation Date, Newely Assigned Employee, and Escalation Reason. This report is crucial for identifying recurring issues that may require process improvements or additional training for the support team.';
        break;
      case 'Client Satisfaction Report':
        description = 'This report compiles client feedback on resolved tickets, offering insights into customer satisfaction levels. It includes Ticket ID, Client ID, Resolved By, Resolution Date, and Client Comments. This report helps understand client perceptions, identify areas for improvement, and make strategic decisions to enhance the quality of customer service.';
        break;
      case 'Ticket Aging Report':
        description = 'This report provides insights into the age of open tickets, categorized by how long they have been unresolved. It includes Ticket ID, Created Date, Assigned Employee, Priority, Current Status, and Days Open. This report helps managers identify tickets that have been open for extended periods, enabling them to address potential bottlenecks, improve resolution times, and ensure timely support.';
        break;
      case 'Open Tickets Report':
        description = 'This report lists all currently open tickets, providing insights into unresolved issues. It includes details such as Ticket ID, Ticket Description, Created Date, Assigned Employee, and Priority helping managers track outstanding tasks and allocate resources effectively.';
        break;
      case 'Closed Tickets Report':
        description = 'This report compiles all tickets that have been resolved, offering a historical view of completed tasks. It includes Ticket ID, Resolution Date, Resolved By, and Resolution Time, which aids in performance analysis and resolution efficiency assessment.';
        break;
      case 'Tickets by Client Report':
        description = 'This report shows all pending tickets categorized by Client, allowing for workload assessment and performance monitoring. It includes Employee Name, Status, Ticket Description and Client Name, helping in identifying bottlenecks and redistributing tasks if necessary.';
        break;
      case 'Ticket Status Summary Report':
        description = 'This report provides a monthly breakdown of ticket data, categorized by ticket statuses. It includes headings for Ticket ID, Ticket Description and relevant data for the ticket status. This helps in identifying trends and evaluating the efficiency of the support team over time.';
        break;
      case 'Employee Performance Report':
        description = 'This report evaluates the performance of each employee by breaking down ticket data per employee. It includes headings for each employee and calculated totals for tickets handled and average resolution time. This is crucial for performance appraisals and identifying areas for improvement.';
        break;
      case 'Tickets by Date Range Report':
        description = 'This report allows users to specify a date range to generate a customized view of tickets created, resolved, or pending within that timeframe. It includes fields such as Ticket ID, Ticket Description, Created Date, providing flexible reporting to meet various business needs.';
        break;
      case 'Monthly Ticket Trend Report':
        description = 'This management report displays a graphical analysis of the number of tickets created, tickets in progress and tickets resolved over time. It includes a line graph and a table with calculations for total tickets created, in progress and resolved. This visual representation helps in quickly understanding workload trends and the efficiency of the support process.';
        break;
      case 'Tickets Summary Report':
        description = 'This report offers a comprehensive summary of ticket statuses, tags, and priorities over a month at a time, providing insights into the overall workload and efficiency of the support team.';
        break;
    }

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(description, 10, 60, { maxWidth: 190 });
  }

  async previewPDFReport() {
    this.isLoading = true;
    if (!this.selectedReportType) {
      alert('Please select a report type');
      this.isLoading = false;
      return;
    }

    if (this.pdfSrc) {
      if (typeof this.pdfSrc === 'string') {
        URL.revokeObjectURL(this.pdfSrc);
      }
    }

    const doc = new jsPDF();
    this.addReportHeader(doc, this.selectedReportType, this.FindUser()); 
    this.addReportDescription(doc, this.selectedReportType);

    try {
      switch (this.selectedReportType) {
        case 'Tickets Escalation Report':
          await this.generateTicketEscalationReport(doc);
          break;
        case 'Client Satisfaction Report':
          await this.generateClientSatisfactionReport(doc);
          break;
        case 'Ticket Aging Report':
          await this.generateTicketAgingReport(doc);
          break;
        case 'Open Tickets Report':
          await this.generateOpenTicketsReport(doc);
          break;
        case 'Closed Tickets Report':
          await this.generateClosedTicketsReport(doc);
          break;
        case 'Tickets by Client Report':
          await this.generateTicketsByClientReport(doc);
          break;
        case 'Employee Performance Report':
          await this.generateAgentPerformanceReport(doc);
          break;
        case 'Ticket Status Summary Report':
          await this.generateTicketStatusSummaryReport(doc);
          break;
        case 'Tickets by Date Range Report':
          await this.generateTicketsByDateRangeReport(doc, this.startDate!, this.endDate!);
          break;
        case 'Monthly Ticket Trend Report':
          await this.generateMonthlyTicketTrendReport(doc);
          break;
        case 'Tickets Summary Report':
          await this.generateTicketsSummaryReport(doc);
          break;
      }

      // Convert the document to a Blob and set it as the preview source
      const pdfArrayBuffer = doc.output('arraybuffer');
      this.pdfSrc = new Uint8Array(pdfArrayBuffer);
  
      this.isLoading = false;
      this.cdr.detectChanges();
    } catch (error) {
      this.isLoading = false;
      console.error('Error generating PDF preview:', error);
      alert('An error occurred while generating the PDF preview. Please try again.');
    }
  }
  


  //-------------- REPORT FUNCTIONS ----------------------------//
  formatDateReport(dateString: string): string {
    if (!dateString) {
      return 'N/A';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
  }

  formatDateTimeReport(dateString: string): string {
    if (!dateString) {
      return 'N/A';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    // Options for both date and time
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Use 24-hour format
    };
    return date.toLocaleString(undefined, options);
  }
  
  
  formatResolutionTime(totalMinutes: number | null): string {
    if (typeof totalMinutes !== 'number' || totalMinutes === null) {
      return 'N/A';  // Return 'N/A' if the input is null or not a number
    }
  
    if (isNaN(totalMinutes)) {
      console.error('Invalid totalMinutes value:', totalMinutes);
      return 'Data Error';  // Return an error message if the totalMinutes is NaN
    }
  
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
  
    return `${days}d:${hours}h:${minutes}m`; // Formatting as Days:Hours:Minutes
  }

  formatClosedResolutionTime(resolutionTime: string | null): string {
    if (!resolutionTime) {
      return 'N/A'; 
    }
  
    try {
      const [days, time] = resolutionTime.split('.');
      const [hours, minutes] = time.split(':');
      return `${parseInt(days)}d:${parseInt(hours)}h:${parseInt(minutes)}m`;
    } catch (error) {
      console.error('Error formatting resolution time:', error);
      return 'Format Error'; 
    }
  }

calculateResolutionTimeInMinutes(resolutionTime: number): number {
  if (isNaN(resolutionTime)) {
    console.log('Invalid resolutionTime:', resolutionTime); 
  }
  return resolutionTime;
}

parseResolutionTime(resolutionTime: any): number {
  console.log('Attempting to parse resolution time:', resolutionTime);

  if (typeof resolutionTime !== 'string') {
    console.warn('Resolution time is not in string format:', resolutionTime);
    return 0;  
  }

  const parts = resolutionTime.split('.');
  if (parts.length !== 2) {
    console.warn('Resolution time format is incorrect:', resolutionTime);
    return 0;  
  }

  const [days, time] = parts;
  const timeParts = time.split(':');
  if (timeParts.length !== 3) {
    console.warn('Time part format is incorrect:', time);
    return 0;  
  }

  const [hours, minutes, seconds] = timeParts.map(Number);
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    console.warn('One or more time parts are not numbers:', timeParts);
    return 0;
  }

  const totalMinutes = (+days * 24 * 60) + (hours * 60) + minutes + Math.round(seconds / 60);
  return totalMinutes;
}

calculateAverageResolutionTime(resolutionTimes: number[]): number {
  if (resolutionTimes.length === 0) return 0;
  const totalMinutes = resolutionTimes.reduce((acc, curr) => acc + curr, 0);
  return totalMinutes / resolutionTimes.length;
}

formatResolutionTimeDetailed(timeInMinutes: number): string {
  const days = Math.floor(timeInMinutes / (24 * 60));
  const hours = Math.floor((timeInMinutes % (24 * 60)) / 60);
  const minutes = Math.floor(timeInMinutes % 60);
  return `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

addTotals(data: SummaryData[], fields: string[]): void {
  const totalRow = fields.reduce((acc: SummaryData, field: string) => {
    acc[field] = data.reduce((sum: number, item: any) => sum + (Number(item[field]) || 0), 0);
    return acc;
  }, { month: 'Total' } as SummaryData);
  data.push(totalRow);
}

sortByMonth(data: SummaryData[]): SummaryData[] {
  return data.sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA.getTime() - dateB.getTime();
  });
}

 //-------------- REPORT FUNCTIONS ----------------------------//

 async generateTicketsSummaryReport(doc: jsPDF): Promise<void> {
  try {
    const data = await firstValueFrom(this.reportingService.getTicketsSummaryReport());

    const processData = (summary: SummaryData[], totalsFields: string[]): SummaryData[] => {
      const sorted = this.sortByMonth(summary);
      this.addTotals(sorted, totalsFields);
      return sorted;
    };

    data.prioritySummary = processData(data.prioritySummary, ['low', 'medium', 'high', 'total']);
    data.tagSummary = processData(data.tagSummary, ['infrastructure', 'connectivity', 'generalSupport', 'total']);
    data.statusSummary = processData(data.statusSummary, ['open', 'closed', 'inProgress', 'reopened', 'breached', 'total']);

    let yPos = 80;

    const createTable = (sectionTitle: string, headers: string[], data: SummaryData[], startY: number): number => {
      doc.setFontSize(12);
      doc.text(sectionTitle, 14, startY);
      startY += 10;

      doc.autoTable({
        startY: startY,
        theme: 'grid',
        head: [headers],
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        body: data.map(item => headers.map(header => {
          if (header === 'Month') {
            return item.month;
          } else {
            const key = header.charAt(0).toLowerCase() + header.slice(1).replace(/\s+/g, '');
            const value = item[key];
            return typeof value === 'number' ? value.toString() : value;
          }
        })),
        columnStyles: { 0: { cellWidth: 40 } },
        willDrawCell: (data: any) => {
          if (data.section === 'body') {
            if (data.row.index === data.table.body.length - 1) {
              doc.setFillColor(221, 221, 221);
              doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
            } else if (data.row.index % 2 === 0) {
              doc.setFillColor(240, 240, 240);
              doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
            }
          }
        },
        styles: { fontSize: 10 },
        margin: { top: 30 }
      });

      return doc.lastAutoTable.finalY;
    };

    yPos = createTable('Priority Summary', ['Month', 'Low', 'Medium', 'High', 'Total'], data.prioritySummary, yPos);
    yPos = createTable('Tag Summary', ['Month', 'Infrastructure', 'Connectivity', 'General Support', 'Total'], data.tagSummary, yPos + 10);
    yPos = createTable('Status Summary', ['Month', 'Open', 'Closed', 'In Progress', 'Reopened', 'Breached', 'Total'], data.statusSummary, yPos + 10);

    doc.text('End of report', 14, yPos + 20);

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Tickets Summary Report:', error);
    throw error;
  }
}

async generateOpenTicketsReport(doc: jsPDF): Promise<void> {
  try {
    const data: OpenTicketReport[] = await firstValueFrom(this.reportingService.getOpenTicketsReport());

    let yPos = 90;

    const headers = ['Ticket ID', 'Description', 'Creation Date', 'Assigned Employee', 'Priority'];

    const body = data.map(ticket => [
      ticket.ticketID.toString(),
      ticket.title,
      this.formatDateReport(ticket.creationDate),
      ticket.assignedAgent,
      ticket.priority
    ]);

    const totalRow = ['Total', '', '', '', data.length.toString()];
    body.push(totalRow);

    doc.autoTable({
      startY: yPos,
      theme: 'grid',
      head: [headers],
      body: body,
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 70 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 20 }
      },
      willDrawCell: (data: any) => {
        if (data.row.index % 2 === 0 && data.row.section === 'body') {
          doc.setFillColor(240, 240, 240);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
        if (data.row.raw === totalRow) {
          doc.setFont('helvetica', 'bold');
          doc.setFillColor(221, 221, 221);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
      styles: { font: 'helvetica', fontSize: 10 },
      margin: { top: 30 }
    });

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Open Tickets Report:', error);
    throw error;
  }
}

async generateTicketEscalationReport(doc: jsPDF): Promise<void> {
  try {
    const data: TicketEscalationReport[] = await firstValueFrom(this.reportingService.getTicketEscalationReport());

    let yPos = 90;

    const headers = ['Escalation ID', 'Ticket ID', 'Previous Employee', 'New Employee', 'Reason for Escalation', 'Date of Escalation'];

    const body = data.map(escalation => [
      escalation.escalationID.toString(),
      escalation.ticketID.toString(),
      escalation.previousEmployee,
      escalation.newEmployee,
      escalation.reasonForEscalation,
      this.formatDateTimeReport(escalation.dateOfEscalation)
    ]);

    const totalRow = ['Total', '', '', '', '', data.length.toString()];
    body.push(totalRow);

    doc.autoTable({
      startY: yPos,
      theme: 'grid',
      head: [headers],
      body: body,
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 30 }
      },
      willDrawCell: (data: any) => {
        if (data.row.index % 2 === 0 && data.section === 'body' && data.row.raw !== totalRow) {
          doc.setFillColor(240, 240, 240);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
        if (data.row.raw === totalRow) {
          doc.setFont('helvetica', 'bold');
          doc.setFillColor(221, 221, 221);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
      styles: { font: 'helvetica', fontSize: 10 },
      margin: { top: 30 }
    });

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Ticket Escalation Report:', error);
    throw error;
  }
}

async generateClosedTicketsReport(doc: jsPDF): Promise<void> {
  try {
    const data: ClosedTicketReport[] = await firstValueFrom(this.reportingService.getClosedTicketsReport());

    console.log('Closed Tickets Data:', data);

    if (data.length === 0) {
      console.warn('No closed tickets data available');
      return;
    }

    let yPos = 90;

    const headers = ['Ticket ID', 'Description', 'Resolution Date', 'Resolution Time (D:H:M)', 'Resolved By'];
    const body = data.map(ticket => [
      ticket.ticketID.toString(),
      ticket.title,
      this.formatDateReport(ticket.closureDate),
      this.formatResolutionTime(parseInt(ticket.resolutionTime)),
      ticket.assignedAgent
    ]);

    const totalTickets = data.length;

    body.push(['Total', '', '', '', totalTickets.toString()]);

    doc.autoTable({
      startY: yPos,
      theme: 'grid',
      head: [headers],
      body: body,
      columnStyles: { 0: { cellWidth: 40 } },
      willDrawCell: (data: any) => {
        if (data.row.section === 'head') {
          doc.setFont('helvetica', 'bold');
          doc.setFillColor(0, 51, 102);
          doc.setTextColor(255, 255, 255);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        } else if (data.row.section === 'body') {
          if (data.row.index % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }
          if (data.row.index === data.table.body.length - 1) {
            doc.setFillColor(221, 221, 221);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }
        }
      },
      styles: { fontSize: 10 },
      margin: { top: 30 }
    });

    yPos = doc.lastAutoTable.finalY;

    doc.text('End of report', 14, yPos + 20);

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Closed Tickets Report:', error);
    throw error;
  }
}

async generateTicketsByClientReport(doc: jsPDF): Promise<void> {
  try {
    const data: TicketByClientReport[] = await firstValueFrom(this.reportingService.getTicketsByClientReport());

    data.sort((a, b) => a.clientName.localeCompare(b.clientName));

    let yPos = 90;
    const headers = ['Ticket ID', 'Description', 'Status', 'Assigned Employee', 'Client Name'];

    doc.autoTable({
      startY: yPos,
      theme: 'grid',
      head: [headers],
      body: data.map(ticket => [
        ticket.ticketID.toString(),
        ticket.title,
        ticket.status,
        ticket.assignedAgent,
        ticket.clientName
      ]),
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 40 } },
      willDrawCell: (data: any) => {
        if (data.row.index % 2 === 0 && data.section === 'body') {
          doc.setFillColor(240, 240, 240);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    const totals = data.reduce((acc: Record<string, number>, ticket: TicketByClientReport) => {
      acc[ticket.clientName] = (acc[ticket.clientName] || 0) + 1;
      return acc;
    }, {});

    const totalTickets = Object.values(totals).reduce((sum, current) => sum + current, 0);

    doc.autoTable({
      startY: yPos,
      theme: 'grid',
      head: [['Client Name', 'Total Tickets']],
      body: [...Object.entries(totals).map(([clientName, total]) => [clientName, total.toString()]), ["Total", totalTickets.toString()]],
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 90 } },
      willDrawCell: (data: any) => {
        if (data.row.index % 2 === 0 && data.section === 'body') {
          doc.setFillColor(220, 220, 220);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
      headStyles: { fillColor: [1, 102, 177], textColor: [255, 255, 255] }
    });

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Tickets By Client Report:', error);
    throw error;
  }
}

async generateAgentPerformanceReport(doc: jsPDF): Promise<void> {
  try {
    const data: AgentPerformanceReport[] = await firstValueFrom(this.reportingService.getAgentPerformanceReport());

    let yPos = 90;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Employee Summary', 10, yPos);
    yPos += 10;

    const summaryHeaders = [['Employee Name', 'Tickets per Employee', 'Resolution Time per Employee']];

    const summaryBody = [];
    let grandTotalTickets = 0;
    let grandTotalResolutionTime = 0;

    data.forEach(agent => {
      const resolutionTimes: number[] = [];
      agent.tickets.forEach(ticket => {
        const resolutionTime = ticket.resolutionTime ? this.parseResolutionTime(ticket.resolutionTime) : null;
        if (resolutionTime !== null) {
          resolutionTimes.push(resolutionTime);
        }
      });

      const totalTickets = resolutionTimes.length;
      const totalResolutionTime = resolutionTimes.reduce((acc, time) => acc + time, 0);
      const averageResolutionTime = totalTickets > 0 ? totalResolutionTime / totalTickets : 0;

      summaryBody.push([
        agent.agentName,
        totalTickets.toString(),
        totalTickets > 0 ? this.formatResolutionTimeDetailed(averageResolutionTime) : 'N/A'
      ]);

      grandTotalTickets += totalTickets;
      grandTotalResolutionTime += totalResolutionTime;
    });

    const overallAverageResolutionTime = grandTotalTickets > 0 ? grandTotalResolutionTime / grandTotalTickets : 0;

    summaryBody.push([
      'Total tickets',
      grandTotalTickets.toString(),
      '-'
    ]);
    summaryBody.push([
      'Average Resolution Time',
      '-',
      this.formatResolutionTimeDetailed(overallAverageResolutionTime)
    ]);

    doc.autoTable({
      startY: yPos,
      theme: 'grid',
      head: summaryHeaders,
      body: summaryBody,
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' } },
      willDrawCell: (data: any) => {
        if (data.row.section === 'body') {
          if (data.row.index === summaryBody.length - 2 || data.row.index === summaryBody.length - 1) {
            doc.setFillColor(200, 200, 200);
            doc.setFont('helvetica', 'bold');
          } else if (data.row.index % 2 === 0) {
            doc.setFillColor(240, 240, 240);
          }
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
      margin: { top: 30, bottom: 10 }
    });

    yPos = doc.lastAutoTable.finalY + 20;

    data.forEach(agent => {
      doc.setFont('helvetica', 'bold');
      doc.text(`Employee: ${agent.agentName}`, 10, yPos);
      yPos += 10;

      const headers = [['Ticket ID', 'Description', 'Resolution Time (D:H:M)']];

      const body = [];
      const resolutionTimes: number[] = [];
      agent.tickets.forEach(ticket => {
        const resolutionTime = ticket.resolutionTime ? this.parseResolutionTime(ticket.resolutionTime) : null;
        if (resolutionTime !== null) {
          resolutionTimes.push(resolutionTime);
        }
        body.push([
          ticket.ticketID,
          ticket.title,
          resolutionTime !== null ? this.formatResolutionTimeDetailed(resolutionTime) : 'N/A'
        ]);
      });

      body.push([
        'Total Tickets Resolved:',
        resolutionTimes.length.toString(),
        `Average Resolution Time: ${this.formatResolutionTimeDetailed(
          resolutionTimes.reduce((acc, time) => acc + time, 0) / resolutionTimes.length
        )}`
      ]);

      doc.autoTable({
        startY: yPos,
        theme: 'grid',
        head: headers,
        body: body,
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: 40 }, 2: { cellWidth: 'auto' } },
        willDrawCell: (data: any) => {
          if (data.row.section === 'body' && data.row.index % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }
        },
        margin: { top: 30, bottom: 10 }
      });

      yPos = doc.lastAutoTable.finalY + 10;
    });

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Employee Performance Report:', error);
    throw error;
  }
}

async generateTicketStatusSummaryReport(doc: jsPDF): Promise<void> {
  try {
    const data: TicketStatusSummaryReport[] = await firstValueFrom(this.reportingService.getTicketStatusSummaryReport());

    let yPos = 90;

    const createTable = (sectionTitle: string, headers: string[], tickets: TicketDetailsReport[], startY: number) => {
      doc.setFont('helvetica', 'bold');
      doc.text(sectionTitle, 10, startY);
      startY += 10;

      doc.autoTable({
        startY: startY,
        theme: 'grid',
        head: [headers],
        body: tickets.map(ticket => headers.map(header => {
          let value = '';
          switch (header.toLowerCase()) {
            case 'ticket id': value = ticket.ticketID.toString(); break;
            case 'description': value = ticket.title; break;
            case 'priority': value = ticket.priority; break;
            case 'date created': value = this.formatDateReport(ticket.dateCreated); break;
            case 'assigned employee': value = ticket.assignedEmployee || 'N/A'; break;
            case 'client': value = ticket.client; break;
            case 'date resolved': value = this.formatDateReport(ticket.dateResolved); break;
            case 'resolution time': value = ticket.resolutionTime ? this.formatClosedResolutionTime(ticket.resolutionTime.toString()) : 'N/A'; break;
            case 'resolved by': value = ticket.assignedEmployee || 'N/A'; break;
            case 'date reopened': value = this.formatDateReport(ticket.dateReopened); break;
            case 'breached date': value = this.formatDateReport(ticket.breachedDate); break;
            case 'time breached for': value = ticket.timeBreachedFor ? this.formatResolutionTime(ticket.timeBreachedFor) : 'N/A'; break;
            case 'employee assigned': value = ticket.assignedEmployee || 'N/A'; break;
          }
          return value;
        })),
        columnStyles: {
          0: { cellWidth: 40 },
        },
        willDrawCell: (data: any) => {
          if (data.row.index === data.table.body.length - 1) {
            doc.setFont('helvetica', 'bold');
          }
          if (data.row.index % 2 === 0 && data.section === 'body' && data.row.index !== data.table.body.length - 1) {
            doc.setFillColor(240, 240, 240);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }
        },
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        margin: { top: 30 }
      });
      return doc.lastAutoTable.finalY;
    };

    data.forEach(status => {
      let headers: string[] = [];
      switch (status.status.toLowerCase()) {
        case 'open':
        case 'in progress':
          headers = ['Ticket ID', 'Description', 'Priority', 'Date Created', 'Assigned Employee', 'Client'];
          break;
        case 'closed':
          headers = ['Ticket ID', 'Description', 'Priority', 'Date Resolved', 'Resolution Time', 'Resolved By'];
          break;
        case 'reopened':
          headers = ['Ticket ID', 'Description', 'Priority', 'Date Reopened', 'Employee Assigned'];
          break;
        case 'breached':
          headers = ['Ticket ID', 'Description', 'Priority', 'Breached Date', 'Time Breached For', 'Employee Assigned'];
          break;
        default:
          headers = ['Ticket ID', 'Description', 'Resolution Time'];
      }

      yPos = createTable(`Status: ${status.status}`, headers, status.tickets, yPos);
    });

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Ticket Status Summary Report:', error);
    throw error;
  }
}

async generateTicketsByDateRangeReport(doc: jsPDF, startDate: string, endDate: string): Promise<void> {
  try {
    const data: TicketByDateRangeReport[] = await firstValueFrom(this.reportingService.getTicketsByDateRangeReport(startDate, endDate));

    let yPos = 90;

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const startDateFormatted = `Date Started: ${startDateObj.toLocaleDateString('en-GB')}  Time: ${startDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    const endDateFormatted = `Date Ended: ${endDateObj.toLocaleDateString('en-GB')}  Time: ${endDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(startDateFormatted, 10, yPos);
    yPos += 5;
    doc.text(endDateFormatted, 10, yPos);

    yPos += 15;

    const headers = ['Ticket ID', 'Description', 'Status', 'Creation Date', 'Assigned Employee'];

    doc.autoTable({
      startY: yPos,
      theme: 'grid',
      head: [headers],
      body: data.map(ticket => [
        ticket.ticketID.toString(),
        ticket.title,
        ticket.status,
        this.formatDateReport(ticket.creationDate),
        ticket.assignedAgent
      ]),
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 80 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 }
      },
      willDrawCell: (data: any) => {
        if (data.row.index % 2 === 0 && data.section === 'body') {
          doc.setFillColor(240, 240, 240);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
      didParseCell: (data: any) => {
        if (data.section === 'head') {
          doc.setFont('helvetica', 'bold');
          doc.setFillColor(0, 51, 102);
          doc.setTextColor(255, 255, 255);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      margin: { top: 30 }
    });

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Tickets By Date Range Report:', error);
    throw error;
  }
}

async generateTicketAgingReport(doc: jsPDF): Promise<void> {
  try {
    const data: TicketAgingReport[] = await firstValueFrom(this.reportingService.getTicketAgingReport());

    let yPos = 90;

    const columns: { header: string, dataKey: keyof TicketAgingReport }[] = [
      { header: 'Ticket ID', dataKey: 'ticketID' },
      { header: 'Description', dataKey: 'title' },
      { header: 'Creation Date', dataKey: 'creationDate' },
      { header: 'Assigned Employee', dataKey: 'assignedEmployee' },
      { header: 'Priority', dataKey: 'priority' },
      { header: 'Current Status', dataKey: 'currentStatus' },
      { header: 'Days Open', dataKey: 'daysOpen' }
    ];

    doc.autoTable({
      startY: yPos,
      theme: 'grid',
      head: [columns.map(col => col.header)],
      body: data.map(ticket => columns.map(col => {
        let value = ticket[col.dataKey];
        if (value == null) { // Checks for both null and undefined
          value = ''; // Or use 'N/A' or any default value you'd prefer
        }
        if (col.dataKey === 'creationDate') {
          return this.formatDateReport(value.toString());
        }
        return value.toString();
      })),
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 45 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 }
      },
      willDrawCell: (data: any) => {
        if (data.row.index % 2 === 0 && data.section === 'body') {
          doc.setFillColor(240, 240, 240);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
    });

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Ticket Aging Report:', error);
    throw error;
  }
}

async generateClientSatisfactionReport(doc: jsPDF): Promise<void> {
  try {
    const data: ClientSatisfactionReport[] = await firstValueFrom(this.reportingService.getClientSatisfactionReport());

    let yPos = 90;

    const headers = ['Ticket ID', 'Client Name', 'Resolved By', 'Resolution Date', 'Client Comments'];

    doc.autoTable({
      startY: yPos,
      theme: 'grid',
      head: [headers],
      body: data.map(feedback => [
        feedback.ticketID ? feedback.ticketID.toString() : 'N/A',
        feedback.clientName || 'N/A',
        feedback.resolvedBy || 'N/A',
        feedback.resolutionDate ? this.formatDateReport(feedback.resolutionDate) : 'N/A',
        feedback.clientComments || 'N/A'
      ]),
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 80 }
      },
      willDrawCell: (data: any) => {
        if (data.row.index % 2 === 0 && data.section === 'body') {
          doc.setFillColor(240, 240, 240);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
    });

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Client Satisfaction Report:', error);
    throw error;
  }
}

async generateMonthlyTicketTrendReport(doc: jsPDF): Promise<void> {
  try {
    const data: MonthlyTicketTrendReport[] = await firstValueFrom(this.reportingService.getMonthlyTicketTrendReport());

    data.sort((a: MonthlyTicketTrendReport, b: MonthlyTicketTrendReport) => {
      const [yearA, monthA] = a.month.split('-').map(Number);
      const [yearB, monthB] = b.month.split('-').map(Number);
      return new Date(yearA, monthA - 1).getTime() - new Date(yearB, monthB - 1).getTime();
    });

    let yPos = 90;

    const headers = ['Month', 'Created', 'Resolved', 'In Progress'];

    doc.autoTable({
      startY: yPos,
      theme: 'grid',
      head: [headers],
      body: data.map((trend: MonthlyTicketTrendReport) => [
        trend.month,
        trend.created.toString(),
        trend.resolved.toString(),
        trend.pending.toString()
      ]),
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 }
      },
      willDrawCell: (data: any) => {
        if (data.row.index % 2 === 0 && data.section === 'body') {
          doc.setFillColor(230, 230, 230);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    try {
      const chartImage = await this.generateChart(data);
      doc.addImage(chartImage, 'PNG', 2, yPos, 170, 80);
    } catch (error) {
      console.error('Error generating chart:', error);
    }

    // Removed doc.save() and doc.output('blob') from here
  } catch (error) {
    console.error('Error generating Monthly Ticket Trend Report:', error);
    throw error;
  }
}

generateChart(data: MonthlyTicketTrendReport[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const chartContainer = this.chartContainer.nativeElement;
    chartContainer.innerHTML = ''; // Clear previous chart content
    console.log(chartContainer);


    const options: AgChartOptions = {
      data: data,
      container: chartContainer,
      width: 800, // Explicitly set width
      height: 400, // Explicitly set height
      title: {
        text: 'Monthly Ticket Trend Line Graph'
      },
      series: [
        {
          type: 'line',
          xKey: 'month',
          yKey: 'created',
          yName: 'Created',
        },
        {
          type: 'line',
          xKey: 'month',
          yKey: 'resolved',
          yName: 'Resolved',
        },
        {
          type: 'line',
          xKey: 'month',
          yKey: 'pending',
          yName: 'In Progress',
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Date'
          }
        },
        {
          type: 'number',
          position: 'left',
          title: {
            text: 'Number of Tickets'
          }
        }
      ],
    };

    const chart = AgCharts.create(options);
    console.log(chart);

    // Wait for the chart to be rendered
    setTimeout(() => {
      try {
        const svg = chartContainer.querySelector('canvas')!.toDataURL('image/png');
        resolve(svg);
      } catch (error) {
        reject(error);
      } finally {
        chart.destroy();
      }
    }, 2000); // Adjust the timeout as needed
  });
}

// Helper function to wrap text within a specified width
wrapText(doc: jsPDF, text: string, maxWidth: number): string {
  const words = text.split(' ');
  let lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
      let testLine = currentLine + word + ' ';
      let testWidth = doc.getTextWidth(testLine);
      if (testWidth > maxWidth && currentLine.length > 0) {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
      } else {
          currentLine = testLine;
      }
  });

  if (currentLine.length > 0) {
      lines.push(currentLine.trim());
  }

  return lines.join('\n');
}

addReportHeader(doc: jsPDF, title: string, userName: string) {
  const imgGroup = new Image();
  imgGroup.src = '/assets/Images/ReportImages/bmwgroup.png';
  doc.addImage(imgGroup.src, 'PNG', 25, 14, 24, 19);

  const imgLogo = new Image();
  imgLogo.src = '/assets/Images/ReportImages/bmwlogo-background-removed.png';
  doc.addImage(imgLogo.src, 'PNG', 160, 10, 25, 25);

  doc.setFont('helvetica');
  doc.setFontSize(18);
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, 40);  // Title

  doc.setFontSize(12);
  // Date positioned on the right
  const date = `Date: ${new Date().toLocaleDateString()}`;
  const dateWidth = doc.getTextWidth(date);
  doc.text(date, pageWidth - dateWidth - 10, 55);  // Right align date

  // Generated By positioned on the left
  const generatedBy = `Generated By: ${userName}`;
  doc.text(generatedBy, 10, 55);  // Left align Generated By
}

  //========================================== Reporting ==============================================//

  //========================================== Chart Builds ==============================================//
  availableCharts: any[] = [
    {
      label: 'Closed Tickets For Last 3 Months',
      value: 'closedTickets',
      options: {
        data: [],
        series: [{
          type: 'line',
          xKey: 'date',
          yKey: 'count',
          stroke: '#4caf50',
          marker: {
            shape: 'circle',
            size: 6
          },
          calloutLabel: {
            enabled: true,
            color: localStorage.getItem('textColor'), // Color for the callout labels
          },
          sectorLabel: {
            enabled: true,
            color: localStorage.getItem('textColor'), // Color for labels inside pie sectors
          },
        }],
        axes: [{
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Date',
            color: localStorage.getItem('textColor')
          },
          label: {
            rotation: 45,
            formatter: (params: { value: string | number | Date }) => {
              const date = new Date(params.value);
              return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
            },
            color: localStorage.getItem('textColor')
          }
        }, {
          type: 'number',
          position: 'left',
          title: {
            text: 'Count',
            color: localStorage.getItem('textColor')
          },
          label: {
            color: localStorage.getItem('textColor')
          }
        }],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor'), // Color of the legend text
            }
          }
        }
      },
      selected: false
    },
    {
      label: 'Ticket Status Distribution',
      value: 'ticketStatus',
      options: {
        data: [],
        series: [{
          type: 'pie',
          angleKey: 'count',
          calloutLabelKey: 'status',
          fills: ['#2196f3', '#f44336', '#9c27b0', '#ff9800', '#4caf50'],
          strokes: ['#2196f3', '#f44336', '#9c27b0', '#ff9800', '#4caf50'],
          calloutLabel: {
            enabled: true,
            color: localStorage.getItem('textColor'), // Color for the callout labels
          },
          sectorLabel: {
            enabled: true,
            color: localStorage.getItem('textColor'), // Color for labels inside pie sectors
          },
          
        }],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor'), // Color of the legend text
            }
          }
        }
      },
      selected: false
    },
    {
      label: 'Tickets Created vs. Resolved Over Time',
      value: 'ticketsCreatedResolvedOverTime',
      options: {
        data: [],
        series: [
          {
            type: 'line',
            xKey: 'date',
            yKey: 'created_count',
            stroke: '#4caf50',
            marker: {
              shape: 'circle',
              size: 6
            }
          },
          {
            type: 'line',
            xKey: 'date',
            yKey: 'resolved_count',
            stroke: '#ff9800',
            marker: {
              shape: 'circle',
              size: 6
            }
          }
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: {
              text: 'Date',
              color: localStorage.getItem('textColor')
            },
            label: {
              rotation: 45,
              formatter: (params: { value: string }) => {
                // Return the preformatted date directly
                return params.value; // No further parsing required
              },
              color: localStorage.getItem('textColor')
            }
          },
          {
            type: 'number',
            position: 'left',
            title: {
              text: 'Count',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          }
        ],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor'), // Color of the legend text
            }
          }
        }
      },
      selected: false
    },
    {
      label: 'Average Resolution Time',
      value: 'averageResolutionTime',
      options: {
        data: [],
        series: [
          {
            type: 'line',
            xKey: 'date',
            yKey: 'avg_resolution_time',
            stroke: '#4caf50',
            marker: {
              shape: 'circle',
              size: 6
            }
          }
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: {
              text: 'Date',
              color: localStorage.getItem('textColor')
            },
            label: {
              rotation: 45,
              formatter: (params: { value: string | number | Date }) => params.value,
              color: localStorage.getItem('textColor')
            }
          },
          {
            type: 'number',
            position: 'left',
            title: {
              text: 'Resolution Time (Hours)', // Update title to indicate hours
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor'),
              formatter: (params: { value: number }) => `${params.value} h` // Add 'h' to the labels
            }
          }
        ],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor'), // Color of the legend text
            }
          }
        }
      },
      selected: false
    },
    {
      label: 'Tickets by Priority',
      value: 'ticketsByPriority',
      options: {
        data: [],
        series: [
          {
            type: 'bar',
            xKey: 'priority_name',
            yKey: 'count',
            fills: ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0'],
            strokes: ['#1b5e20', '#e65100', '#b71c1c', '#0d47a1', '#4a148c']
          } as AgBarSeriesOptions<any>
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: {
              text: 'Priority',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          } as AgCategoryAxisOptions,
          {
            type: 'number',
            position: 'left',
            title: {
              text: 'Count',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          } as AgNumberAxisOptions
        ],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor'), // Color of the legend text
            }
          }
        }
      } as AgCartesianChartOptions
    },
    {
      label: 'Tickets by Tag',
      value: 'ticketsByTag',
      options: {
        data: [],
        series: [
          {
            type: 'bar',
            xKey: 'tag_name',
            yKey: 'count',
            fill: '#FFA500', 
            stroke: '#000000'
          } as AgBarSeriesOptions<any>
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: {
              text: 'Tag',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          } as AgCategoryAxisOptions,
          {
            type: 'number',
            position: 'left',
            title: {
              text: 'Count',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          } as AgNumberAxisOptions
        ],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor'), // Color of the legend text
            }
          }
        }
      } as AgCartesianChartOptions
    },
    {
      label: 'Tickets Assigned to Employees',
      value: 'ticketsAssignedToEmployees',
      options: {
        data: [],
        series: [
          {
            type: 'bar',
            xKey: 'employee_Name',
            yKey: 'count',
            fill: '#4caf50', 
            stroke: '#000000'
          } as AgBarSeriesOptions<any>
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: {
              text: 'Employee',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          } as AgCategoryAxisOptions,
          {
            type: 'number',
            position: 'left',
            title: {
              text: 'Count',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          } as AgNumberAxisOptions
        ],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor'), // Color of the legend text
            }
          }
        }
      } as AgCartesianChartOptions
    },
    {
      label: 'Tickets by Client',
      value: 'ticketsByClient',
      options: {
        data: [],
        series: [
          {
            type: 'bar',
            xKey: 'client_Name',
            yKey: 'count',
            fill: '#800080', 
            stroke: '#000000', 
          } as AgBarSeriesOptions<any>
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: {
              text: 'Client',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          } as AgCategoryAxisOptions,
          {
            type: 'number',
            position: 'left',
            title: {
              text: 'Count',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          } as AgNumberAxisOptions
        ],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor'), // Color of the legend text
            }
          }
        }
      } as AgCartesianChartOptions
    },
    {
      label: 'Predictive Trend of Tickets Created for Next Month',
      value: 'ticketsCreatedOverTime',
      options: {
        data: [],
        series: [
          {
            type: 'line',
            xKey: 'date',
            yKey: 'count',
            stroke: '#4caf50',
            marker: {
              shape: 'circle',
              size: 6
            },
          }
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: {
              text: 'Date',
              color: localStorage.getItem('textColor')
            },
            label: {
              rotation: 45,
              formatter: (params: { value: string }) => {
                // Return the preformatted date directly
                return params.value; // No further parsing required
              },
              color: localStorage.getItem('textColor')
            }
          },
          {
            type: 'number',
            position: 'left',
            title: {
              text: 'Count',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          }
        ],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor'), // Color of the legend text
            }
          }
        }
      },
      selected: false
    }
  ];

  //========================================== Chart Builds ==============================================//

  //============= Arrays ==============//
  selectedCharts: string[] = [];

  closedTicketsData: ClosedTicket[] = [];
  ticketStatusData: any = null;
  ticketsCreatedResolvedOverTimeData: any[] = [];
  averageResolutionTimeData: any[] = [];
  ticketsByPriorityData: any[] = [];
  ticketsByTagData: any[] = [];
  ticketsAssignedToEmployeesData: any[] = [];
  ticketsByClientData: any[] = [];
  ticketsCreatedOverTimeData: any[] = [];
  //============= Arrays ==============//


  //========================================== Select and Display Charts ==============================================//

  updateChartsData(): void {
    this.displayedCharts.forEach(chart => {
      if (chart.value === 'closedTickets') {
        this.loadClosedTicketsPastWeek();
      } else if (chart.value === 'ticketStatus') {
        this.loadTicketStatusCounts();
      } else if (chart.value === 'ticketsCreatedResolvedOverTime') {
        this.loadTicketsCreatedResolvedOverTime();
      } else if (chart.value === 'averageResolutionTime') {
        this.loadAverageResolutionTime();
      } else if (chart.value === 'ticketsByPriority') {
        this.loadTicketsByPriority();
      } else if (chart.value === 'ticketsByTag') {
        this.loadTicketsByTag();
      } else if (chart.value === 'ticketsAssignedToEmployees') {
        this.loadTicketsAssignedToEmployees();
      } else if (chart.value === 'ticketsByClient') {
        this.loadTicketsByClient();
      } else if (chart.value === 'ticketsCreatedOverTime') {
        this.loadTicketsCreatedOverTime();
      }
    });
  }
  //========================================== Select and Display Charts ==============================================//


  //====================================================================================================================//
  //======================================== LOAD AND UPDATE METHODS FOR CHARTS ========================================//
  //====================================================================================================================//


  //========================================== Closed Tickets Past Week ==============================================//
  loadClosedTicketsPastWeek(): void {
    this.reportingService.getClosedTicketsPastWeek().subscribe({
      next: (data: ClosedTicket[]) => {
        this.closedTicketsData = data.map((item: ClosedTicket) => ({
          ...item,
          date: new Date(item.date).toISOString().split('T')[0],
        }));
        this.updateClosedTicketsChart(); 
      },
      error: (err) => console.error('Failed to load closed tickets past week', err)
    });
  }

  updateClosedTicketsChart(): void {
    const closedTicketsChart = this.displayedCharts.find(chart => chart.value === 'closedTickets');
    if (closedTicketsChart && this.closedTicketsData) {
      closedTicketsChart.options = {
        ...closedTicketsChart.options,
        data: this.closedTicketsData
      } as AgCartesianChartOptions;
    }
  }
  //========================================== Closed Tickets Past Week ==============================================//


  //========================================== Ticket Status Count ==============================================//
  loadTicketStatusCounts(): void {
    this.reportingService.getTicketStatusCounts().subscribe({
      next: (data) => {
        this.ticketStatusData = data;
        this.updateTicketStatusChart(); 
      },
      error: (err) => console.error('Failed to load ticket status counts', err)
    });
  }

  updateTicketStatusChart(): void {
    const ticketStatusChart = this.displayedCharts.find(chart => chart.value === 'ticketStatus');
    if (ticketStatusChart && this.ticketStatusData) {
      ticketStatusChart.options = {
        ...ticketStatusChart.options,
        data: this.ticketStatusData
      } as AgChartOptions;
    }
  }
  //========================================== Ticket Status Count ==============================================//



  //========================================== Ticket Created vs Resolved ==============================================//
  loadTicketsCreatedResolvedOverTime(): void {
    this.reportingService.getTicketsCreatedResolvedOverTime().subscribe({
      next: (data: TicketsCreatedResolvedOverTimeItem[]) => {
        this.ticketsCreatedResolvedOverTimeData = data.map((item: TicketsCreatedResolvedOverTimeItem) => {
          // Parse and format the date manually to ensure consistency
          const rawDate = item.date.split('T')[0]; // Get the date part only
          const [year, month, day] = rawDate.split('-'); // Split into components
          const formattedDate = `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`; // Format as yyyy/mm/dd
          
          return {
            ...item,
            date: formattedDate,
            created_count: item.created_Count,
            resolved_count: item.resolved_Count
          };
        });
        this.updateTicketsCreatedResolvedOverTimeChart(); 
      },
      error: (err) => console.error('Failed to load tickets created vs. resolved over time', err)
    });
  }
  
  
  
  

  updateTicketsCreatedResolvedOverTimeChart(): void {
    const ticketsCreatedResolvedOverTimeChart = this.displayedCharts.find(chart => chart.value === 'ticketsCreatedResolvedOverTime');
    if (ticketsCreatedResolvedOverTimeChart && this.ticketsCreatedResolvedOverTimeData) {
      ticketsCreatedResolvedOverTimeChart.options = {
        ...ticketsCreatedResolvedOverTimeChart.options,
        data: this.ticketsCreatedResolvedOverTimeData
      };
    }
  }
  //========================================== Ticket Created vs Resolved ==============================================//





  //========================================== Ticket Average Resolution Time ==============================================//
  loadAverageResolutionTime(): void {
    this.reportingService.getAverageResolutionTime().subscribe({
      next: (data: AverageResolutionTimeItem[]) => {
        this.averageResolutionTimeData = data.map((item: AverageResolutionTimeItem) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString('en-CA') 
        }));
        this.updateAverageResolutionTimeChart(); 
      },
      error: (err) => console.error('Failed to load average resolution time', err)
    });
  }

  updateAverageResolutionTimeChart(): void {
    const averageResolutionTimeChart = this.displayedCharts.find(chart => chart.value === 'averageResolutionTime');
    if (averageResolutionTimeChart && this.averageResolutionTimeData) {
      averageResolutionTimeChart.options = {
        ...averageResolutionTimeChart.options,
        data: this.averageResolutionTimeData,
        series: [{
          type: 'line',
          xKey: 'date',
          yKey: 'avg_Resolution_Time', 
          stroke: '#4caf50',
          marker: {
            shape: 'circle',
            size: 6
          }
        }],
        axes: [{
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Date',
            color: localStorage.getItem('textColor')!
          },
          label: {
            rotation: 45,
            formatter: (params: { value: string | number | Date }) => params.value,
            color: localStorage.getItem('textColor')!
          }
        }, {
          type: 'number',
          position: 'left',
          title: {
            text: 'Hours',
            color: localStorage.getItem('textColor')!
          },
          label: {
            color: localStorage.getItem('textColor')!
          }
        }],
        
      };
    }
  }
  //========================================== Ticket Average Resolution Time ==============================================//


  
  //========================================== Tickets by Priority ==============================================//
  loadTicketsByPriority(): void {
    this.reportingService.getTicketsByPriority().subscribe({
      next: (data) => {
        this.ticketsByPriorityData = data.map((item: any) => ({
          priority_name: item.priority_Name, 
          count: item.count, 
        }));
        this.updateTicketsByPriorityChart(); 
      },
      error: (err) => console.error('Failed to load tickets by priority', err)
    });
  }

  updateTicketsByPriorityChart(): void {
    const ticketsByPriorityChart = this.displayedCharts.find(chart => chart.value === 'ticketsByPriority');
    if (ticketsByPriorityChart && this.ticketsByPriorityData) {
      ticketsByPriorityChart.options = {
        ...ticketsByPriorityChart.options,
        data: this.ticketsByPriorityData
      } as AgCartesianChartOptions;
    }
  }
  //========================================== Tickets by Priority ==============================================//
  

  

  //========================================== Tickets by Tag ==============================================//
  loadTicketsByTag(): void {
    this.reportingService.getTicketsByTag().subscribe({
      next: (data: any[]) => {
        this.ticketsByTagData = data.map((item: any) => ({
          ...item,
          tag_Name: item.tag_Name, 
          count: item.count
        }));
        this.updateTicketsByTagChart(); 
      },
      error: (err) => console.error('Failed to load tickets by tag', err)
    });
  }

  updateTicketsByTagChart(): void {
    const ticketsByTagChart = this.displayedCharts.find(chart => chart.value === 'ticketsByTag');
    if (ticketsByTagChart && this.ticketsByTagData) {
      ticketsByTagChart.options = {
        ...ticketsByTagChart.options,
        data: this.ticketsByTagData,
        series: [{
          type: 'bar',
          xKey: 'tag_Name',
          yKey: 'count',
          fillOpacity: 0.7,
          fill: '#FFA500', 
          stroke: '#000000', 
        }],
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: {
              text: 'Tag',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          },
          {
            type: 'number',
            position: 'left',
            title: {
              text: 'Count',
              color: localStorage.getItem('textColor')
            },
            label: {
              color: localStorage.getItem('textColor')
            }
          }
        ],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor'), // Color of the legend text
            }
          }
        }
      } as AgCartesianChartOptions;
    }
  }
  //========================================== Tickets by Tag ==============================================//
  





  
  //========================================== Tickets by Assigned Employee ==============================================//
  loadTicketsAssignedToEmployees(): void {
    this.reportingService.getTicketsAssignedToEmployees().subscribe({
      next: (data: { employee_Name: string; count: number }[]) => {
        this.ticketsAssignedToEmployeesData = data.map(item => ({
          employee_Name: item.employee_Name,
          count: item.count
        }));
  
        this.updateTicketsAssignedToEmployeesChart(); 
      },
      error: (err) => console.error('Failed to load tickets assigned to employees', err)
    });
}


updateTicketsAssignedToEmployeesChart(): void {
  const ticketsAssignedToEmployeesChart = this.displayedCharts.find(chart => chart.value === 'ticketsAssignedToEmployees');
  if (ticketsAssignedToEmployeesChart && this.ticketsAssignedToEmployeesData) {
    ticketsAssignedToEmployeesChart.options = {
      ...ticketsAssignedToEmployeesChart.options,
      data: this.ticketsAssignedToEmployeesData,
      series: [{
        type: 'bar',
        xKey: 'employee_Name',
        yKey: 'count',
        fillOpacity: 0.7,
        fill: '#4caf50', 
        stroke: '#000000', 
      }],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Employee',
            color: localStorage.getItem('textColor')
          },
          label: {
            color: localStorage.getItem('textColor')
          }
        },
        {
          type: 'number',
          position: 'left',
          title: {
            text: 'Count',
            color: localStorage.getItem('textColor')
          },
          label: {
            color: localStorage.getItem('textColor')
          }
        }
      ],
      background: {
        fill: 'rgba(0,0,0,0)'
      },
      legend: {
        position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
        item: {
          label: {
            color: localStorage.getItem('textColor'), // Color of the legend text
          }
        }
      }
    } as AgCartesianChartOptions;
  }
}
  //========================================== Tickets by Assigned Employee ==============================================//




  //========================================== Tickets by Client ==============================================//
  loadTicketsByClient(): void {
    this.reportingService.getTicketsByClient().subscribe({
      next: (data) => {
        this.ticketsByClientData = data;
        this.updateTicketsByClientChart(); 
      },
      error: (err) => console.error('Failed to load tickets by client', err)
    });
  }

  updateTicketsByClientChart(): void {
    const ticketsByClientChart = this.displayedCharts.find(chart => chart.value === 'ticketsByClient');
    if (ticketsByClientChart && this.ticketsByClientData) {
      ticketsByClientChart.options = {
        ...ticketsByClientChart.options,
        data: this.ticketsByClientData
      } as AgCartesianChartOptions;
    }
  }
  //========================================== Tickets by Client ==============================================//




  //========================================== Tickets created over time ==============================================//
  loadTicketsCreatedOverTime(): void {
    this.reportingService.getTicketsCreatedOverTime().subscribe({
      next: (data: TicketsCreatedOverTimeItem[]) => {
        this.ticketsCreatedOverTimeData = data.map((item: TicketsCreatedOverTimeItem) => {
          // Split the date string and manually construct the formatted date
          const rawDate = item.date.split('T')[0]; // Get the date part only
          const [year, month, day] = rawDate.split('-'); // Split into components
          const formattedDate = `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`; // Format as yyyy/mm/dd
          
          return {
            ...item,
            date: formattedDate,
            count: item.count
          };
        });
        this.updateTicketsCreatedOverTimeChart(); 
      },
      error: (err) => console.error('Failed to load tickets created over time', err)
    });
  }
  
  updateTicketsCreatedOverTimeChart(): void {
    const ticketsCreatedOverTimeChart = this.displayedCharts.find(chart => chart.value === 'ticketsCreatedOverTime');
    if (ticketsCreatedOverTimeChart && this.ticketsCreatedOverTimeData) {
      ticketsCreatedOverTimeChart.options = {
        ...ticketsCreatedOverTimeChart.options,
        data: this.ticketsCreatedOverTimeData
      } as AgCartesianChartOptions;
    }
  }
  //========================================== Tickets created over time ==============================================//

  availableReports = [{id: 1, name:"Open Tickets Report"},{id: 2, name:"Ticket Status Summary Report"}]
  timeintervals = [{id: 1, name:"Daily"},{id: 2, name:"Weekly"},{id: 3, name:"Bi-weekly"},{id: 4, name:"Monthly"}]

  
}