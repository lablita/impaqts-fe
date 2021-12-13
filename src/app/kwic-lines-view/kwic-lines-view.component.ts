import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { KWICline } from '../model/kwicline';

@Component({
  selector: 'app-kwic-lines-view',
  templateUrl: './kwic-lines-view.component.html',
  styleUrls: ['./kwic-lines-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class KwicLinesViewComponent implements OnInit {

  @Input() public kwicLines: KWICline[] = [];
  @Input() public loading: boolean = false;
  @Input() loadConcordances = (event: any) => { };

  // public loading = false;
  public totalResults = 0;
  public videoUrl: SafeResourceUrl | null = null;
  public displayModal = false;
  public youtubeVideo: boolean = true;

  constructor(
    private readonly sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void { }

  public showVideoDlg(rowIndex: number): void {
    this.youtubeVideo = rowIndex % 2 > 0;
    let url = '';

    if (this.youtubeVideo) {
      url = 'https://www.youtube.com/embed/OBmlCZTF4Xs';
      const start = Math.floor((Math.random() * 200) + 1);
      const end = start + Math.floor((Math.random() * 20) + 1);
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '?autoplay=1'
          + (start ? `&start=${start}` : '') + (end ? `&end=${end}` : ''));
      }
    } else {
      url = 'https://player.vimeo.com/video/637089218';
      const start = Math.floor((Math.random() * 5) + 1) + 'm' + Math.floor((Math.random() * 60) + 1) + 's';
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '?autoplay=1#t=' + start);
      }
    }

    this.displayModal = true;
  }





}
