import {Component, ViewChild} from '@angular/core';
import {EventTemplateService} from "../../../shared/event-template.service";
import {ToastrService} from "ngx-toastr";
import {NgForm } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EventTemplate} from "../../../shared/event-template";

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
  category: string;

  constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService, private eventTemplateService: EventTemplateService) {
    this.category = this.route.snapshot.params['category'];
    this.addEventTemplateForm.category = this.category;
  }

  AddEventTemplate(isValid: any) {
    this.isSubmitted = true;

    if (isValid) {
      this.eventTemplateService.create(this.addEventTemplateForm).then((success) => {
        this.toastr.success('success');
        setTimeout(() => {
          this.router.navigate(['event-template', this.category]);
        }, 500);
      })
        .catch((error: any) => {
        console.log(error);
      });
    }
  }
}

export class eventTemplateForm {
  order: number = 0;
  name: string = "";
  category: string = "";
  weight: number = 0;
  duration: number = 0;
  categories: string = "";
  postProcessing: string = "";
}

