import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  @Input() public videoUrl: string | null = null;
  @Input() public autoplay = 0;
  @Input() public start = 0;
  @Input() public end = 0;

  public ytPlayerVisible = false;
  public urlComplete: SafeResourceUrl | null = null;

  constructor(
    private readonly sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if (this.videoUrl && this.videoUrl.length > 0) {
      this.urlComplete = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl + '?autoplay=' + (this.autoplay ? this.autoplay : 0)
        + (this.start ? `&start=${this.start}` : 0) + (this.end ? `&end=${this.end}` : 0));
    }
  }

  public toggleVideoPlayer(): void {
    this.ytPlayerVisible = !this.ytPlayerVisible;
  }

}
