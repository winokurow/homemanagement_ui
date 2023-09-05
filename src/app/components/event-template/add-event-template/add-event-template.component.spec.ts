import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventTemplateComponent } from './add-event-template.component';

describe('AddEventTemplateComponent', () => {
  let component: AddEventTemplateComponent;
  let fixture: ComponentFixture<AddEventTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEventTemplateComponent]
    });
    fixture = TestBed.createComponent(AddEventTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
