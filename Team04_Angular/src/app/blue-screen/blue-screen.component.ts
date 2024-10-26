import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-blue-screen',
  templateUrl: './blue-screen.component.html',
  styleUrls: ['./blue-screen.component.scss']
})
export class BlueScreenComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.enterFullscreen();
    this.initPercentageProcess();
  }

  ngOnDestroy(): void {
    this.exitFullscreen();
  }

  // Function to enter fullscreen mode
  enterFullscreen(): void {
    const elem = document.documentElement; // Fullscreen the entire document (page)
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) { // Fallback for older WebKit browsers
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) { // Fallback for older IE/Edge browsers
      (elem as any).msRequestFullscreen();
    }
  }

  // Function to exit fullscreen mode
  exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) { // Fallback for older WebKit browsers
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) { // Fallback for older IE/Edge browsers
      (document as any).msExitFullscreen();
    }
  }

  // Function to handle the percentage process
  initPercentageProcess(): void {
    const percentageElement = document.getElementById("percentage") as HTMLElement;

    let percentage = 0;

    function process() {
      percentage += Math.floor(Math.random() * 20);
      if (percentage > 100) {
        percentage = 100;
      }
      percentageElement.innerText = percentage.toString();
      processInterval();
    }

    function processInterval() {
      setTimeout(process, Math.random() * 500 + 1000);
    }

    processInterval();
  }
}
