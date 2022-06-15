import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FieldRequest } from '../model/field-request';
import { KWICline } from '../model/kwicline';
import { ResultContext } from '../model/result-context';
import { LoadResultsService } from '../services/load-results.service';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-concordance-table',
  templateUrl: './concordance-table.component.html',
  styleUrls: ['./concordance-table.component.scss']
})
export class ConcordanceTableComponent implements OnInit {

  @Input() public initialPagination = 10;
  @Input() public paginations: Array<number> = Array.from<number>({ length: 0 });;
  @Input() public visible = false;

  public loading = false;
  public totalResults = 0;
  public kwicLines: Array<KWICline> = Array.from<KWICline>({ length: 0 });
  public noResultFound = true;
  public resultContext: ResultContext | null = null;
  public displayModal = false;
  public videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/OBmlCZTF4Xs');

  public fieldRequest: FieldRequest | null = null;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService
  ) {
    this.loadResultService.getWebSocketResponse().subscribe(socketResponse => {
      this.loading = false;
      if (socketResponse) {
        this.totalResults = socketResponse.totalResults;
        this.kwicLines = socketResponse.kwicLines;
        this.noResultFound = socketResponse.noResultFound;
      }
    });
    this.emitterService.makeConcordance.subscribe(fieldRequest => {
      this.loading = true;
      this.fieldRequest = fieldRequest;
      this.loadResultService.loadResults(fieldRequest);
    });
  }

  ngOnInit(): void {
  }

  public loadConcordance(event: any): void {
    if (this.fieldRequest) {
      this.loading = true;
      this.loadResultService.loadResults(this.fieldRequest, event);
    }
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