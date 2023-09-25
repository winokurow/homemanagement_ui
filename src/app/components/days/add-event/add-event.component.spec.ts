import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventComponent } from './add-event.component';

describe('AddEventTemplateComponent', () => {
  let component: AddEventComponent;
  let fixture: ComponentFixture<AddEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEventComponent]
    });
    fixture = TestBed.createComponent(AddEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
