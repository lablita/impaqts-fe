import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  @Input() public videoUrl: string;
  @Input() public autoplay: number;
  @Input() public start: number;
  @Input() public end: number;

  public ytPlayerVisible = false;
  public urlComplete: SafeResourceUrl;

  constructor(
    private readonly sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if (this.videoUrl?.length > 0) {
      this.urlComplete = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl + '?autoplay=' + (this.autoplay ? this.autoplay : 0)
        + (this.start ? `&start=${this.start}` : '') + (this.end ? `&end=${this.end}` : ''));
    }
  }

  public toggleVideoPlayer(): void {
    this.ytPlayerVisible = !this.ytPlayerVisible;
  }

}
