import { Component, OnInit } from '@angular/core';
import { CORPUS_INFO } from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-all-words-or-lemmas',
  templateUrl: './all-words-or-lemmas.component.html',
  styleUrls: ['./all-words-or-lemmas.component.scss']
})
export class AllWordsOrLemmasComponent implements OnInit {

  constructor(
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.emitterService.clickLabel.emit(new KeyValueItem(CORPUS_INFO, CORPUS_INFO));
  }

}
