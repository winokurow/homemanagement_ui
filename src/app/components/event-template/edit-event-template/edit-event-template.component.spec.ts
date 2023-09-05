import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventTemplateComponent } from './edit-event-template.component';

describe('EditEventTemplateComponent', () => {
  let component: EditEventTemplateComponent;
  let fixture: ComponentFixture<EditEventTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEventTemplateComponent]
    });
    fixture = TestBed.createComponent(EditEventTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
