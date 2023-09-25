import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayEventListComponent } from './day-event-list.component';

describe('EventTemplateListComponent', () => {
  let component: DayEventListComponent;
  let fixture: ComponentFixture<DayEventListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayEventListComponent]
    });
    fixture = TestBed.createComponent(DayEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
