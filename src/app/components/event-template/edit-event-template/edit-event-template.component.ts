import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {EventTemplateService} from "../../../shared/services/event-template.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {EventTemplate} from "../../../shared/model/event-template";

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

  eventTemplateId: string;

  constructor(private toastr: ToastrService, private route: ActivatedRoute, private router: Router,
     private eventTemplateService: EventTemplateService) { }

  ngOnInit(): void {
    this.eventTemplateId = this.route.snapshot.params['id'];
    this.getEventTemplateDetailById();
  }
  getEventTemplateDetailById() {
    let eventTemplate = this.eventTemplateService.eventTemplateList
      .find(obj => obj.id === this.eventTemplateId);

      this.editEventTemplateForm.order = eventTemplate.order;
      this.editEventTemplateForm.name = eventTemplate.name;
      this.editEventTemplateForm.category = eventTemplate.category;
      this.editEventTemplateForm.weight = eventTemplate.weight;
      this.editEventTemplateForm.duration = eventTemplate.duration;
      this.editEventTemplateForm.categories = eventTemplate.categories;
      this.editEventTemplateForm.postprocess = eventTemplate.postprocess;
    this.editEventTemplateForm.creationDate = eventTemplate.creationDate;
  }

  clickEditEventTemplate(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      const eventTemplate : EventTemplate = this.editEventTemplateForm;
      eventTemplate.id = this.eventTemplateId;
      //eventTemplate.id = this.eventTemplateId
      this.eventTemplateService.updateById(eventTemplate).then((success) => {
        this.toastr.success('success');
        setTimeout(() => {
          this.router.navigate(['event-template', this.editEventTemplateForm.category]);
        }, 500);
      })
        .catch(error => {
          console.log(error);
          this.router.navigate(['event-template', this.editEventTemplateForm.category]);
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
  creationDate: Date;
}
