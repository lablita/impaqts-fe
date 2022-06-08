import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { KWICline } from '../model/kwicline';
import { ResultContext } from '../model/result-context';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-concordance-table',
  templateUrl: './concordance-table.component.html',
  styleUrls: ['./concordance-table.component.scss']
})
export class ConcordanceTableComponent implements OnInit {

  @Input() public loading = false;
  @Input() public initialPagination = 10;
  @Input() public totalResults = 0;
  @Input() public paginations: number[] = [];
  @Input() public kwicLines: KWICline[] = [];
  @Input() public visible = false;
  @Output() public loadResults = new EventEmitter<any>();

  public resultContext: ResultContext | null = null;
  public displayModal = false;
  public videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/OBmlCZTF4Xs');

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.emitterService.makeConconrdance.subscribe(() => this.loadResults.emit());
  }

  public loadConcordance(event: any): void {
    this.loadResults.emit(event);
  }

  public showVideoDlg(rowIndex: number): void {
    const youtubeVideo = rowIndex % 2 > 0;
    let url = '';

    if (youtubeVideo) {
      url = 'https://www.youtube.com/embed/OBmlCZTF4Xs';
      const start = Math.floor((Math.random() * 200) + 1);
      const end = start + Math.floor((Math.random() * 20) + 1);
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `${url}?autoplay=1&start=${start}&end=${end}`
        );
      }
    } else {
      url = 'https://player.vimeo.com/video/637089218';
      const start = `${Math.floor((Math.random() * 5) + 1)}m${Math.floor((Math.random() * 60) + 1)}s`;
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${url}?autoplay=1#t=${start}`);
      }
    }

    this.displayModal = true;
  }

  public showDialog(kwicline: KWICline): void {
    // kwicline.ref to retrive info
    this.resultContext = new ResultContext(kwicline.kwic,
      kwicline.leftContext + kwicline.leftContext, kwicline.rightContext + kwicline.rightContext);
  }

}
