import { Component, HostBinding, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Report, ReportCreateUpdate } from '../../../Classes/report-select';
import { ReportoptinService } from '../../../Services/Reporting/reportoptin.service';

@Component({
  selector: 'app-report-opt-in',
  templateUrl: './report-opt-in.component.html',
  styleUrl: './report-opt-in.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ReportOptInComponent implements OnInit {

  darkMode = signal<boolean>(false);
  @HostBinding("class.dark") get mode() {
    return this.darkMode();
  }

  getDarkMode() {
    console.log(localStorage.getItem("darkMode"));
    if (localStorage.getItem("darkMode") == "[Signal: true]") {
      return true;
    } else {
      return false;
    }
  }

  reportForm: FormGroup;
  reportTypes = [
    { id: 1, name: 'Open Tickets Reports' },
    { id: 2, name: 'Ticket Status Summary Report' }
  ];
  
  intervals = [
    { id: 1, name: 'Daily' },
    { id: 2, name: 'Weekly' },
    { id: 3, name: 'Bi-weekly' },
    { id: 4, name: 'Monthly' },
  ];

  constructor(private reportService: ReportoptinService, private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      selectedReports: this.fb.array([])
    });
  }

  ngOnInit(): void {
    //this.initializeForm();
    // Uncomment the following line when you're ready to load reports from the service
     this.loadReports();
     this.darkMode.set(this.getDarkMode());
  }

  initializeForm() {
    this.reportForm = this.fb.group({
      selectedReports: this.fb.array([])
    });
  }

  get selectedReportsFormArray(): FormArray {
    return this.reportForm.get('selectedReports') as FormArray;
  }

  isReportTypeSelected(reportTypeId: number): boolean {
    return this.selectedReportsFormArray.controls.some(
      control => control.value.reportTypeId === reportTypeId
    );
  }

  onCheckboxChange(reportType: any, event: any) {
    if (event.target.checked) {
      this.selectedReportsFormArray.push(this.fb.group({
        reportTypeId: reportType.id,
        intervalId: this.getPreSelectedInterval(reportType.id) || 0
      }));
    } else {
      const index = this.selectedReportsFormArray.controls.findIndex(
        x => x.value.reportTypeId === reportType.id
      );
      if (index >= 0) {
        this.selectedReportsFormArray.removeAt(index);
      }
    }
  }

  onIntervalChange(reportTypeId: number, event: any) {
    const index = this.selectedReportsFormArray.controls.findIndex(
      x => x.value.reportTypeId === reportTypeId
    );
    if (index >= 0) {
      this.selectedReportsFormArray.at(index).patchValue({ intervalId: +event.target.value });
    }
  }

  getPreSelectedInterval(reportTypeId: number): number {
    const report = this.selectedReportsFormArray.controls.find(
      control => control.value.reportTypeId === reportTypeId
    );
    return report ? report.value.intervalId : 0;
  }

  onSubmit() {
    console.log(this.reportForm.value);
    // Here you can send the form data to your service
    const selectedReports = this.reportForm.get('selectedReports') as FormArray;
    const submissionData: ReportCreateUpdate[] = selectedReports.controls.map(control => {
      return {
        reportTypeId: control.value.reportTypeId,
        intervalId: control.value.intervalId
      };
    });

    console.log('Submission data:', submissionData);

    // Here you would typically send the data to your service
    this.reportService.createReports(submissionData).subscribe(
      response => {
        console.log('Reports submitted successfully', response);
        // Handle successful submission (e.g., show a success message)
      },
      error => {
        console.error('Error submitting reports', error);
        // Handle error (e.g., show an error message)
      }
    );
  }

  //Uncomment and implement this method when you're ready to load reports from the service
  loadReports(): void {
    this.reportService.getReports().subscribe(
      (data: Report[]) => {
        data.forEach(report => {
          this.selectedReportsFormArray.push(this.fb.group({
            reportTypeId: report.reportTypeId,
            intervalId: report.intervalId
          }));
        });
      },
      (error) => {
        console.error('Error fetching reports', error);
      }
    );
  }
}