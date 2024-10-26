import { Component, HostBinding, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeReportingService } from '../../../Services/Employee/employee-reports.service';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions, AgPolarChartOptions, AgCartesianChartOptions, AgPieSeriesOptions, AgChartTheme } from 'ag-charts-community';

@Component({
  selector: 'app-employee-current-performance',
  standalone: true,
  imports: [CommonModule, AgCharts],
  templateUrl: './employee-reports.component.html',
  styleUrls: ['./employee-reports.component.scss']
})
export class EmployeeCurrentPerformanceComponent implements OnInit {
  displayedStatistics: any[] = []; 
  displayedCharts: any[] = [];
  // Statistics
  openTickets: number = 0;
  breachedTickets: number = 0;
  averageResolutionTime: number = 0;
  lowPriorityTickets: number = 0;
  mediumPriorityTickets: number = 0;
  highPriorityTickets: number = 0;
  currentAssignedTickets: number = 0;

  // Charts
  ticketsAssignedVsClosedOptions: AgChartOptions = {};
  ticketStatusDistributionOptions: AgChartOptions = {};
  averageResolutionTimeTrendOptions: AgChartOptions = {};
  closedTicketsPastWeekOptions: AgChartOptions = {};
  //ticketsByPriorityOptions: AgChartOptions = {};

    //////////////////////////////////////////////////////////////////////////////////// DARKMODE STARTS

    darkMode = signal<boolean>(false);
    @HostBinding('class.dark') get mode() {
      return this.darkMode();
    }
  
    setDarkMode(){
      this.darkMode.set(!this.darkMode());
  
      if (this.getDarkMode()) {
        localStorage.setItem('textColor', 'black');
      }
      else{
        localStorage.setItem('textColor', 'white');
      }
      
      localStorage.setItem('darkMode', this.darkMode.toString());
    }
  
    getDarkMode(){
      console.log(localStorage.getItem('darkMode'));
      if (localStorage.getItem('darkMode') == '[Signal: true]') {
        return true;
      }
      else{
        return false;
      };
    }
  
    /////////////////////////////////////////////////////////////////////////////////// DARKMODE ENDS

  private chartTheme: AgChartTheme = {
    palette: {
      fills: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
      strokes: ['#4063b3', '#82b868', '#e1b54f', '#d65c5c', '#68adc7']
    },
    overrides: {
      common: {
        title: {
          fontSize: 16,
          fontFamily: 'Arial, sans-serif',
          color: localStorage.getItem('textColor')?.toString()
        },
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor')?.toString(), // Color of the legend text
            }
          }
        }
      },
      line: {
        series: {
          strokeWidth: 3,
          marker: {
            enabled: true,
            size: 6
          }
        },
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor')?.toString(), // Color of the legend text
            }
          }
        }
      },
      pie: {
        series: {
          strokeWidth: 1,
        },
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        legend: {
          position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
          item: {
            label: {
              color: localStorage.getItem('textColor')?.toString(), // Color of the legend text
            }
          }
        }
      }
    }
  };

  constructor(private reportingService: EmployeeReportingService) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadCharts();
  }

  loadStatistics() {
    this.reportingService.getOpenTickets().subscribe({
      next: (data) => this.openTickets = data,
      error: (error) => console.error('Error fetching open tickets:', error)
    });

    this.reportingService.getBreachedTickets().subscribe({
      next: (data) => this.breachedTickets = data,
      error: (error) => console.error('Error fetching breached tickets:', error)
    });

    this.reportingService.getAverageResolutionTime().subscribe({
      next: (data) => this.averageResolutionTime = data,
      error: (error) => console.error('Error fetching average resolution time:', error)
    });

    this.reportingService.getPriorityTickets().subscribe({
      next: (data) => {
        this.lowPriorityTickets = data.find((item: { priority: number, count: number }) => item.priority === 1)?.count || 0;
        this.mediumPriorityTickets = data.find((item: { priority: number, count: number }) => item.priority === 2)?.count || 0;
        this.highPriorityTickets = data.find((item: { priority: number, count: number }) => item.priority === 3)?.count || 0;
      },
      error: (error) => console.error('Error fetching priority tickets:', error)
    });

    this.reportingService.getCurrentAssignedTickets().subscribe({
      next: (data) => this.currentAssignedTickets = data,
      error: (error) => console.error('Error fetching current assigned tickets:', error)
    });
  }

  loadCharts() {
    this.loadTicketsAssignedVsClosedChart();
    this.loadTicketStatusDistributionChart();
    this.loadAverageResolutionTimeTrendChart();
    this.loadClosedTicketsPastWeekChart();
    //this.loadTicketsByPriorityChart();
  }
  
  loadTicketsAssignedVsClosedChart() {
    this.reportingService.getTicketsAssignedVsClosed().subscribe({
      next: (data) => {
        if (data && data.assigned && data.closed) {
          // Merge both `assigned` and `closed` data into a single array of unique dates
          const allDates = [
            ...data.assigned.map((a: { date: string }) => a.date),
            ...data.closed.map((c: { date: string }) => c.date)
          ];
          const uniqueDates = Array.from(new Set(allDates)).sort(); // Get unique dates and sort them
  
          // Build the final data array with counts for each date
          const chartData = uniqueDates.map((date) => {
            const assignedCount = data.assigned.find((a: { date: string }) => a.date === date)?.count || 0;
            const closedCount = data.closed.find((c: { date: string }) => c.date === date)?.count || 0;
            return {
              date: new Date(date),
              assigned: assignedCount,
              closed: closedCount
            };
          });
  
          this.ticketsAssignedVsClosedOptions = {
            theme: this.chartTheme,
            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            },
            data: chartData,
            series: [
              { type: 'line', xKey: 'date', yKey: 'assigned', yName: 'Assigned' },
              { type: 'line', xKey: 'date', yKey: 'closed', yName: 'Closed', color: localStorage.getItem('textColor') }
            ],
            axes: [
              { type: 'time', position: 'bottom', title: { text: 'Date', color: localStorage.getItem('textColor') } },
              { type: 'number', position: 'left', title: { text: 'Number of Tickets', color: localStorage.getItem('textColor') } }
            ],
            legend: {
              position: 'bottom',
              item: {
                label: {
                  color: localStorage.getItem('textColor'),
                }
              }
            }
          } as AgCartesianChartOptions;
        }
      },
      error: (error) => console.error('Error fetching data for Tickets Assigned vs Closed chart:', error)
    });
  }
  
  
  loadTicketStatusDistributionChart() {
    this.reportingService.getTicketStatusDistribution().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.ticketStatusDistributionOptions = {
            theme: this.chartTheme,
            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            },
            title: {
              text: 'Ticket Status Distribution',
              fontSize: 16,
              fontWeight: 'bold',
              color: localStorage.getItem('textColor')
            },
            data: data.map(item => ({
              status: this.getStatusName(item.status),
              count: item.count
            })),
            series: [{
              type: 'pie',
              angleKey: 'count',
              labelKey: 'status',
              calloutLabelKey: 'status',
              calloutLabel: {
                enabled: true,
                color: localStorage.getItem('textColor')
              },
              sectorLabelKey: 'count',
              sectorLabel: {
                enabled: true,
                color: localStorage.getItem('textColor'),
                fontSize: 14,
                formatter: (params: any) => `${params.value}`
              },
              innerLabels: [{
                text: 'Tickets',
                fontSize: 14,
                fontWeight: 'bold',
                color: localStorage.getItem('textColor')
              }]
            } as AgPieSeriesOptions],
            legend: {
              position: 'bottom',
              item: {
                label: {
                  color: localStorage.getItem('textColor'),
                }
              }
            }
          } as AgPolarChartOptions;
        }
      },
      error: (error) => console.error('Error fetching data for Ticket Status Distribution chart:', error)
    });
  }
  
  
  loadAverageResolutionTimeTrendChart() {
    this.reportingService.getAverageResolutionTimeTrend().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.averageResolutionTimeTrendOptions = {
            theme: this.chartTheme,
            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            },
            data: data.map(item => ({
              date: new Date(item.date),
              averageTime: item.averageResolutionTime
            })),
            series: [{
              type: 'line',
              xKey: 'date',
              yKey: 'averageTime',
              yName: 'Average Resolution Time (Hours)'
            }],
            axes: [
              { type: 'time', position: 'bottom', title: { text: 'Date', color: localStorage.getItem('textColor') } },
              { type: 'number', position: 'left', title: { text: 'Average Resolution Time (Hours)', color: localStorage.getItem('textColor') } }
            ],
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
      },
      error: (error) => console.error('Error fetching data for Average Resolution Time Trend chart:', error)
    });
  }
  
  loadClosedTicketsPastWeekChart() {
    this.reportingService.getClosedTicketsPastWeek().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.closedTicketsPastWeekOptions = {
            theme: this.chartTheme,
            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            },
            data: data.map(item => ({
              day: this.getDayName(item.dayOfWeek),
              count: item.count
            })),
            series: [{
              type: 'bar',
              xKey: 'day',
              yKey: 'count'
            }],
            axes: [
              { type: 'category', position: 'bottom', title: { text: 'Day of Week', color: localStorage.getItem('textColor') } },
              { type: 'number', position: 'left', title: { text: 'Number of Tickets', color: localStorage.getItem('textColor') } }
            ],
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
      },
      error: (error) => console.error('Error fetching data for Closed Tickets Past Week chart:', error)
    });
  }
  
  // loadTicketsByPriorityChart() {
  //   this.reportingService.getTicketsByPriority().subscribe({
  //     next: (data) => {
  //       if (data && Array.isArray(data)) {
  //         this.ticketsByPriorityOptions = {
  //           theme: this.chartTheme,
  //           padding: {
  //             top: 20,
  //             right: 20,
  //             bottom: 20,
  //             left: 20
  //           },
  //           data: data.map(item => ({
  //             priority: this.getPriorityName(item.priority),
  //             count: item.count
  //           })),
  //           series: [{
  //             type: 'bar',
  //             xKey: 'priority',
  //             yKey: 'count',
  //           }],
  //           axes: [
  //             { type: 'category', position: 'bottom', title: { text: 'Priority', color: localStorage.getItem('textColor') } },
  //             { type: 'number', position: 'left', title: { text: 'Number of Tickets', color: localStorage.getItem('textColor') } }
  //           ],
  //           legend: {
  //             position: 'bottom', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
  //             item: {
  //               label: {
  //                 color: localStorage.getItem('textColor'), // Color of the legend text
  //               }
  //             }
  //           }
  //         } as AgCartesianChartOptions;
  //       }
  //     },
  //     error: (error) => console.error('Error fetching data for Tickets by Priority chart:', error)
  //   });
  // }
  
  
  
  getStatusName(statusId: number): string {
    switch (statusId) {
      case 1: return 'Open';
      case 2: return 'In Progress';
      case 3: return 'Closed';
      case 4: return 'Reopened';
      case 5: return 'Breached';
      default: return 'Unknown';
    }
  }

  getDayName(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  }

  getPriorityName(priorityId: number): string {
    switch (priorityId) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'Unknown';
    }
  }
}