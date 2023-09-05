import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTemplateListComponent } from './event-template-list.component';

describe('EventTemplateListComponent', () => {
  let component: EventTemplateListComponent;
  let fixture: ComponentFixture<EventTemplateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventTemplateListComponent]
    });
    fixture = TestBed.createComponent(EventTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
