import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JobOjs } from '../model/job-obj';
import { KeyValueItem } from '../model/key-value-item';

@Component({
  selector: 'app-my-job',
  templateUrl: './my-job.component.html',
  styleUrls: ['./my-job.component.scss']
})
export class MyJobComponent implements OnInit {

  public jobsLabel: string;
  public jobs: JobOjs[];
  public autoReloaded: boolean;
  public showCom: boolean;

  public cols: KeyValueItem[];
  public _selectedColumns: KeyValueItem[];

  constructor(
    private readonly translateService: TranslateService
  ) {


  }

  ngOnInit(): void {
    this.jobsLabel = 'PAGE.MY_JOBS.MY_JOBS_LABEL';
    this.jobs = [
      new JobOjs('309cbb01ed49ef50f7810108d1a6f377', 'Repubblica', '(Sub)corpus statistics (Freq)', '#', new Date(Date.now()), '0:00:35', 'Completed', 100),
      new JobOjs('53eec6d9b0db401a2f20f345cad47fee', 'EPTIC English spoken sources', '(Sub)corpus statistics (Freq)', '#', new Date(Date.now()), '0:00:35', 'Completed', 100),
      new JobOjs('1d19e89cc7b13ac5c6a50f71385f5190', 'Brexit IT', '(Sub)corpus statistics (Freq)', '#', new Date(Date.now()), '0:00:35', 'Completed', 100),
      new JobOjs('ab7c776d013dac28618192873f98232c', 'Repubblica', '(Sub)corpus statistics (Freq)', '#', new Date(Date.now()), '0:00:35', 'Completed', 100),
      new JobOjs('ab7c776d013dac28618192873f98232c', 'Repubblica', '(Sub)corpus statistics (Freq)', '#', new Date(Date.now()), '0:00:35', 'Completed', 100)
    ];
    this.translateService.get('PAGE.CONCORDANCE.CORPUS').subscribe(corpus => {
      this.cols = [
        new KeyValueItem('corpus', corpus),
        new KeyValueItem('descriptionLabel', this.translateService.instant('PAGE.MY_JOBS.DESCRIPTION')),
        new KeyValueItem('started', this.translateService.instant('PAGE.MY_JOBS.STARTED')),
        new KeyValueItem('estimation', this.translateService.instant('PAGE.MY_JOBS.ESTIMATION')),
        new KeyValueItem('status', this.translateService.instant('PAGE.MY_JOBS.STATUS')),
        new KeyValueItem('progress', this.translateService.instant('PAGE.MY_JOBS.PROGRESS'))
      ];
      this._selectedColumns = this.cols.slice();
    });
  }

  @Input() get selectedColumns(): KeyValueItem[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: KeyValueItem[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

}
