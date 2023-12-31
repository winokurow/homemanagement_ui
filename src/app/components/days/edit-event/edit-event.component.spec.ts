import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventComponent } from './edit-event.component';

describe('EditEventTemplateComponent', () => {
  let component: EditEventComponent;
  let fixture: ComponentFixture<EditEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEventComponent]
    });
    fixture = TestBed.createComponent(EditEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
