import { Component, OnInit } from '@angular/core';
import { PriorityService, Priority } from '../../../Services/Ticket/breach-time.service';

@Component({
  selector: 'app-priority',
  templateUrl: './status-editor.component.html',
  styleUrls: ['./status-editor.component.scss']
})
export class PriorityComponent implements OnInit {
  priorities: Priority[] = [];
  showSuccessModal: boolean = false;
  showConfirmModal: boolean = false;
  selectedPriority: Priority | null = null;

  // Object to hold individual time components for each priority, keyed by priority ID
  priorityTimes: { [id: number]: { days: number, hours: number, minutes: number, seconds: number } } = {};

  constructor(private priorityService: PriorityService) { }

  ngOnInit(): void {
    this.priorityService.getPriorities().subscribe(priorities => {
      this.priorities = priorities;

      // Initialize the object with parsed time values for each priority
      this.priorities.forEach(priority => {
        const timeComponents = this.parseTimeSpan(priority.breachTime); // Parse the TimeSpan string
        this.priorityTimes[priority.priority_ID] = timeComponents;
      });

      console.log(this.priorityTimes);  // Debugging log to ensure priorityTimes is populated
    });
  }

  openSuccessModal() {
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  formatDuration(value: string): string {
    if (!value) return '';

    let days = 0;
    let timePart = value;

    if (value.includes('.')) {
      const parts = value.split('.');
      days = parseInt(parts[0], 10);
      timePart = parts[1];
    }

    const timeParts = timePart.split(':');
    const hours = parseInt(timeParts[0], 10) || 0;
    const minutes = parseInt(timeParts[1], 10) || 0;
    const seconds = parseInt(timeParts[2], 10) || 0;

    const parts = [];

    if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (seconds || parts.length === 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

    return parts.join(' ');
  }

  // Utility function to parse time strings like '7.00:00:00' into { days, hours, minutes, seconds }
  private parseTimeSpan(timeSpan: string): { days: number, hours: number, minutes: number, seconds: number } {
    const regex = /(\d+)\.(\d{2}):(\d{2}):(\d{2})/;
    const matches = timeSpan.match(regex);

    return {
      days: matches && matches[1] ? parseInt(matches[1]) : 0,
      hours: matches && matches[2] ? parseInt(matches[2]) : 0,
      minutes: matches && matches[3] ? parseInt(matches[3]) : 0,
      seconds: matches && matches[4] ? parseInt(matches[4]) : 0
    };
  }

  // Utility function to convert days, hours, minutes, and seconds into 'days.hours:minutes:seconds'
  private toTimeSpanString(days: number, hours: number, minutes: number, seconds: number): string {
    // Ensure the hours, minutes, and seconds are always two digits
    const pad = (num: number) => (num < 10 ? '0' + num : num.toString());
    return `${days}.${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  // Handle manual updates to time input fields
  updateTime(event: any, priorityID: number, field: string): void {
    const value = parseInt(event.target.value, 10);  // Parse the input as a number
    const priorityTimesForID = this.priorityTimes[priorityID]; // Get the relevant time object

    if (priorityTimesForID) {
      priorityTimesForID[field as keyof typeof priorityTimesForID] = value;
    }
  }

  // Build the breach time string and update the priority
  updateBreachTime(priority: Priority): void {
    const time = this.priorityTimes[priority.priority_ID];
    if (time) {
      // Convert the individual time components back into the 'days.hours:minutes:seconds' format
      const breachTimeString = this.toTimeSpanString(time.days, time.hours, time.minutes, time.seconds);

      // Assign the constructed string to the priority's breachTime
      priority.breachTime = breachTimeString;

      this.priorityService.updateBreachTime(priority).subscribe(() => {
        this.closeConfirmationModal();
        this.openSuccessModal();
      });
    }
  }

  openConfirmationModal(priority: Priority) {
    this.selectedPriority = priority;
    this.showConfirmModal = true;
  }

  closeConfirmationModal() {
    this.showConfirmModal = false;
    this.selectedPriority = null;
  }

  confirmUpdate() {
    if (this.selectedPriority) {
      this.updateBreachTime(this.selectedPriority);
    }
  }
}

