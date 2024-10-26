import { AgChartOptions, AgCartesianChartOptions, AgBarSeriesOptions, AgBaseCartesianChartOptions, AgCategoryAxisOptions, AgNumberAxisOptions, AgCharts } from 'ag-charts-community';
import { AgChartsModule } from 'ag-charts-angular';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReportingService } from '../../../Services/Reporting/reporting.service';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../Calendar/calendar/calendar.component';

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
  selector: 'app-a-welcome-page',
  templateUrl: './a-welcome-page.component.html',
  styleUrl: './a-welcome-page.component.scss',
  standalone: true,
  imports: [DatePipe, CommonModule, AgChartsModule, CalendarComponent],
  providers: [DatePipe]
})

export class AWelcomePageComponent implements OnInit {
  constructor(private datePipe: DatePipe, private reportingService: ReportingService) {};

  availableStatistics = [
    { label: 'Open Tickets', value: 'openTickets'},
    { label: 'Closed Tickets', value: 'closedTickets'},
    { label: 'Breached Tickets', value: 'breachedTickets'},
    { label: 'Low Priority Tickets', value: 'lowPriorityTickets'},
    { label: 'Total Tickets Created', value: 'totalTicketsCreated'},
    { label: 'Average Resolution Time', value: 'averageResolutionTime'},
    { label: 'Tickets Reopened', value: 'ticketsReopened'},
    { label: 'Tickets Escalated', value: 'escalatedTicketsLastWeek'},
  ];

  displayedStatistics: any[] = [];
  selectedStatistics: string[] = [];

  startDateStat2: Date | null = null;
  startTime: string = '00:00:00'; 
  endDateStat2: Date | null = null;
  endTime: string = '23:59:59';

  ngOnInit(): void {
    const liveStatistics = localStorage.getItem('livestatistics');
    this.selectedStatistics = liveStatistics ? JSON.parse(liveStatistics) : {};
    const charts = localStorage.getItem('charts');

    if (charts != null) {
      this.selectedCharts = JSON.parse(charts);
    }
    else{
      localStorage.setItem('charts', '');
    }
    
    this.applyStatisticsSelection();
    this.applyChartSelection();
  }

  applyStatisticsSelection(): void {
    this.displayedStatistics = [];

    const formattedStartDate = this.combineDateTime(this.startDateStat2, this.startTime);
    const formattedEndDate = this.combineDateTime(this.endDateStat2, this.endTime)

    this.selectedStatistics.forEach(stat => {
      if (stat === 'openTickets') {
        this.reportingService.getOpenTickets(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            console.log('API Response for Open Tickets:', data);
            this.displayedStatistics.push({ title: 'Open Tickets', value: data });
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'closedTickets') {
        this.reportingService.getClosedTickets(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            console.log('API Response for Closed Tickets:', data);
            this.displayedStatistics.push({ title: 'Closed Tickets', value: data });
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'breachedTickets') {
        this.reportingService.getBreachedTickets(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            console.log('API Response for Breached Tickets:', data);
            this.displayedStatistics.push({ title: 'Breached Tickets', value: data });
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'lowPriorityTickets') {
        this.reportingService.getLowPriorityTickets(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            console.log('API Response for Low Priority Tickets:', data);
            this.displayedStatistics.push({ title: 'Low Priority Tickets', value: data });
          },
          error: (error) => {
            console.error('API Error:', error);
          }
        });
      } else if (stat === 'totalTicketsCreated') {
        this.reportingService.getTotalTicketsCreated(formattedStartDate, formattedEndDate).subscribe({
          next: (data) => {
            console.log('API Response for Total Tickets Created:', data);
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
                value: avgResolutionTime.toFixed(2) 
              });
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
            console.log('API Response for Tickets Reopened:', data);
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
  }
  combineDateTime(date: Date | null, time: string): string | null {
    if (!date || !time) return null;
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    return `${formattedDate}T${time}`;
  }

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
        label: 'Predictive Trend of Tickets Created For Next Month',
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
  displayedCharts: ChartOption[] = [];

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


  applyChartSelection(): void {
    this.displayedCharts = this.availableCharts.filter(chart => this.selectedCharts.includes(chart.value));
    const chartdata: string[] = [];
    this.displayedCharts.forEach(chart => {
      chartdata.push(chart.value);
    })
    console.log(chartdata);
    localStorage.setItem('charts', JSON.stringify(chartdata));
    this.updateChartsData();
  }

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
      console.log('Updated Closed Tickets Options:', closedTicketsChart.options);
    }
  }
  //========================================== Closed Tickets Past Week ==============================================//


  //========================================== Ticket Status Count ==============================================//
  loadTicketStatusCounts(): void {
    this.reportingService.getTicketStatusCounts().subscribe({
      next: (data) => {
        console.log('Ticket Status Data:', data);
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
      console.log('Updated Ticket Status Options:', ticketStatusChart.options);
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
      console.log('Updated Tickets Created vs. Resolved Over Time Options:', ticketsCreatedResolvedOverTimeChart.options);
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
            formatter: params => params.value,
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
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor')!, // Color of the legend text
            }
          }
        }
      };
      console.log('Updated Average Resolution Time Options:', averageResolutionTimeChart.options);
    }
  }
  //========================================== Ticket Average Resolution Time ==============================================//


  
  //========================================== Tickets by Priority ==============================================//
  loadTicketsByPriority(): void {
    this.reportingService.getTicketsByPriority().subscribe({
      next: (data) => {
        console.log('Tickets By Priority Data:', data);
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
      console.log('Updated Tickets By Priority Options:', ticketsByPriorityChart.options);
    }
  }
  //========================================== Tickets by Priority ==============================================//
  

  

  //========================================== Tickets by Tag ==============================================//
  loadTicketsByTag(): void {
    this.reportingService.getTicketsByTag().subscribe({
      next: (data: any[]) => {
        console.log('Tickets By Tag Data:', data);
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
      } as AgCartesianChartOptions;
      console.log('Updated Tickets By Tag Options:', ticketsByTagChart.options);
    }
  }
  //========================================== Tickets by Tag ==============================================//
  





  
  //========================================== Tickets by Assigned Employee ==============================================//
  loadTicketsAssignedToEmployees(): void {
    this.reportingService.getTicketsAssignedToEmployees().subscribe({
      next: (data: { employee_Name: string; count: number }[]) => {
        console.log('API Data:', data); 
        this.ticketsAssignedToEmployeesData = data.map(item => ({
          employee_Name: item.employee_Name,
          count: item.count
        }));
        console.log('Mapped Data:', this.ticketsAssignedToEmployeesData); 
  
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
    } as AgCartesianChartOptions;
    console.log('Updated Tickets Assigned To Employees Options:', ticketsAssignedToEmployeesChart.options);
  }
}
  //========================================== Tickets by Assigned Employee ==============================================//




  //========================================== Tickets by Client ==============================================//
  loadTicketsByClient(): void {
    this.reportingService.getTicketsByClient().subscribe({
      next: (data) => {
        console.log('Tickets By Client Data:', data);
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
      console.log('Updated Tickets By Client Options:', ticketsByClientChart.options);
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
      console.log('Updated Tickets Created Over Time Options:', ticketsCreatedOverTimeChart.options);
    }
  }
  //========================================== Tickets created over time ==============================================//
}
