import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {EventTemplateService} from "../../shared/eventtemplate.service";

@Component({
  selector: 'app-add-event-template',
  templateUrl: './add-event-template.component.html',
  styleUrls: ['./add-event-template.component.scss']
})
export class AddEventTemplateComponent  implements OnInit {
  public eventTemplateForm: FormGroup;
  constructor(
    public crudApi: EventTemplateService,
    public fb: FormBuilder,
    public toastr: ToastrService
  ) {}
  ngOnInit() {
    this.studenForm();
  }
  studenForm() {
    this.eventTemplateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      weight: [''],
      duration: [''],
      categories: [''],
      postProcessing: [''],
    });
  }

  ResetForm() {
    this.eventTemplateForm.reset();
  }
  submitEventTemplateData() {
    this.crudApi.create(this.eventTemplateForm.value);
    this.toastr.success(
      this.eventTemplateForm.controls['name'].value + ' successfully added!'
    );
    this.ResetForm();
  }

  get name() {
    return this.eventTemplateForm.get('name');
  }
}
