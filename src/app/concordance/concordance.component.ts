import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { Corpus } from '../model/corpus';


class RadioButtonCat {
  name: string;
  key: string;

  constructor(name: string, key: string) {
    this.name = name;
    this.key = key;
  }
}

@Component({
  selector: 'app-concordance',
  templateUrl: './concordance.component.html',
  styleUrls: ['./concordance.component.scss']
})
export class ConcordanceComponent implements OnInit {
  public subHeader = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

  public corpusList: Corpus[];
  public selectedCorpus: Corpus;
  public items: SelectItem[];

  public queryTypes: RadioButtonCat[];
  public selectedQueryType: RadioButtonCat;
  public selectCorpus: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {

    this.translateService.get('PAGE.CONCORDANCE.SIMPLE').subscribe(simple => {
      this.selectCorpus = this.translateService.instant('PAGE.CONCORDANCE.SELECT_CORPUS');
      const lemma = this.translateService.instant('PAGE.CONCORDANCE.LEMMA');
      const phrase = this.translateService.instant('PAGE.CONCORDANCE.PHRASE');
      const word = this.translateService.instant('PAGE.CONCORDANCE.WORD');
      const character = this.translateService.instant('PAGE.CONCORDANCE.CHARACTER');
      const cql = this.translateService.instant('PAGE.CONCORDANCE.CQL');
      this.corpusList = this.route.snapshot.data.corpusList;
      this.queryTypes = [
        new RadioButtonCat(simple, simple),
        new RadioButtonCat(lemma, lemma),
        new RadioButtonCat(phrase, phrase),
        new RadioButtonCat(word, word),
        new RadioButtonCat(character, character),
        new RadioButtonCat(cql, cql)
      ];
      this.selectedQueryType = this.queryTypes[0];

    });


  }

}
