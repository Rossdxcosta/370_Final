import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignUpAnimationService {
  private animationFrameId: number | null = null;
  private currentFrame: number = 0;
  private isAnimating: boolean = false;
  private lastFrameTime: number = 0;
  private frameDuration: number = 0;

  startAnimation(
    frameRate: number,
    animationEnabled: boolean,
    onFrame: (frameNumber: number) => void
  ): void {
    if (!animationEnabled) return;

    this.isAnimating = true;
    this.frameDuration = 1000 / frameRate; // Convert fps to ms per frame

    const animate = (timestamp: number) => {
      if (!this.isAnimating) return;

      if (timestamp - this.lastFrameTime >= this.frameDuration) {
        onFrame(this.currentFrame);
        this.currentFrame = (this.currentFrame + 1) % 8;
        this.lastFrameTime = timestamp;
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  stopAnimation(): void {
    this.isAnimating = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.currentFrame = 0;
    this.lastFrameTime = 0;
  }
}
