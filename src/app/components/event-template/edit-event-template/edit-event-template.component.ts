import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import {EventTemplateService} from "../../../shared/event-template.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import { Location } from '@angular/common';
import {EventTemplate} from "../../../shared/event-template";

@Component({
  selector: 'app-edit-event-template',
  templateUrl: './edit-event-template.component.html',
  styleUrls: ['./edit-event-template.component.scss']
})
export class EditEventTemplateComponent  implements OnInit {
  editEventTemplateForm: eventTemplateForm = new eventTemplateForm();

  @ViewChild("eventTemplateForm")
  eventTemplateForm!: NgForm;

  isSubmitted: boolean = false;
  eventTemplateId: any;

  constructor(private toastr: ToastrService, private route: ActivatedRoute, private router: Router,
     private eventTemplateService: EventTemplateService) { }

  ngOnInit(): void {
    this.eventTemplateId = this.route.snapshot.params['id'];
    this.getEventTemplateDetailById();
  }
  getEventTemplateDetailById() {
    this.eventTemplateService.get(this.eventTemplateId)
    .subscribe((data: any) => {
            this.editEventTemplateForm.name = data.data().name;
            this.editEventTemplateForm.weight = data.data().weight;
            this.editEventTemplateForm.duration = data.data().duration;
            this.editEventTemplateForm.categories = data.data().categories;
            this.editEventTemplateForm.postProcessing = data.data().postProcessing;
      },
      (error: any) => { });
  }

  EditEventTemplate(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {

      const eventTemplate = this.editEventTemplateForm
      //eventTemplate.id = this.eventTemplateId
      console.log(this.eventTemplateId)
      console.log(eventTemplate)
      this.eventTemplateService.update(this.eventTemplateId, eventTemplate).then((success) => {
        this.toastr.success('success');
        setTimeout(() => {
          this.router.navigate(['event-template']);
        }, 500);
      })
        .catch(error => {
          console.log(error);
          this.router.navigate(['event-template']);
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
