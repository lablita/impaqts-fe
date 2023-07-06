import { Component, OnInit } from '@angular/core';
import { DisplayPanelService } from '../services/display-panel.service';
import { ActivatedRoute } from '@angular/router';
import { QueryRequestService } from '../services/query-request.service';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit {

  public corpus?: string;

  private searchAttribute?: string;

  constructor(
    private readonly queryRequestService: QueryRequestService,
    private readonly displayPanelService: DisplayPanelService,
    private readonly route: ActivatedRoute
  ) { 
  }

  ngOnInit(): void {
    this.corpus = this.queryRequestService.getCorpus();
    this.searchAttribute = this.route.snapshot.data.searchAttribute;
  }

}
