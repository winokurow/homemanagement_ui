import {Component, ViewChild} from '@angular/core';
import {EventTemplateService} from "../../../shared/services/event-template.service";
import {NgForm } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EventTemplate} from "../../../shared/model/event-template";

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

  constructor(private router: Router, private route: ActivatedRoute,
              private eventTemplateService: EventTemplateService) {
    this.category = this.route.snapshot.params['category'];
    this.addEventTemplateForm.category = this.category;
  }

  clickAddEventTemplate(isValid: any) {
    this.isSubmitted = true;

    if (isValid) {
      this.eventTemplateService.add(this.addEventTemplateForm).then((success) => {
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
  postprocess: string = "";
  creationDate = new Date();
}

