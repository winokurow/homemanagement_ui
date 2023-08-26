import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {EventTemplateService} from "../../shared/eventtemplate.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-event-template',
  templateUrl: './edit-event-template.component.html',
  styleUrls: ['./edit-event-template.component.scss']
})
export class EditEventTemplateComponent  implements OnInit {
  editForm: FormGroup;
  constructor(
    private crudApi: EventTemplateService,
    private fb: FormBuilder,
    private location: Location,
    private actRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.updateEventTemplateData();
    const id = this.actRoute.snapshot.paramMap.get('id');
  }

  updateEventTemplateData() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      weight: [''],
      duration: [''],
      categories: [''],
      postProcessing: [''],
    });
  }
  goBack() {
    this.location.back();
  }
  updateForm() {
    //this.crudApi.update(this.editForm.value);
    this.toastr.success(
      this.editForm.controls['firstName'].value + ' updated successfully'
    );
    this.router.navigate(['view-eventTemplates']);
  }

  get name() {
    return this.editForm.get('name');
  }
}
