import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerypocComponent } from './querypoc.component';

describe('QuerypocComponent', () => {
  let component: QuerypocComponent;
  let fixture: ComponentFixture<QuerypocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuerypocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerypocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
