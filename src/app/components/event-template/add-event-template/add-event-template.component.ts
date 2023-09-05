import {Component, ViewChild} from '@angular/core';
import {EventTemplateService} from "../../../shared/event-template.service";
import {ToastrService} from "ngx-toastr";
import {NgForm } from "@angular/forms";
import {Router} from "@angular/router";
import {EventTemplate} from "../../../shared/event-template";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-add-event-template',
  templateUrl: './add-event-template.component.html',
  styleUrls: ['./add-event-template.component.scss']
})
export class AddEventTemplateComponent {

  addEventTemplateForm: EventTemplate = new eventTemplateForm();

  @ViewChild("eventTemplateForm")
  eventTemplateForm!: NgForm;
  isSubmitted: boolean = false;

  constructor(private router: Router, private toastr: ToastrService, private eventTemplateService: EventTemplateService) {
  }

  AddEventTemplate(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.eventTemplateService.create(this.addEventTemplateForm).then((success) => {
        this.toastr.success('success');
        setTimeout(() => {
          this.router.navigate(['event-template']);
        }, 500);
      })
        .catch(error => {
        console.log(error);
      });
    }
  }
}

export class eventTemplateForm {
  name: string = "";
  weight: number = 0;
  duration: number = 0;
  categories: string = "";
  postProcessing: string = "";
}

