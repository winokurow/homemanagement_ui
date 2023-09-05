import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {EventTemplateService} from "../../../shared/event-template.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

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
    this.eventTemplateService.get(this.eventTemplateId)
    .subscribe((data: any) => {
      this.editEventTemplateForm.order = data.data().order;
      this.editEventTemplateForm.name = data.data().name;
      this.editEventTemplateForm.category = data.data().category;
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
      this.eventTemplateService.update(this.eventTemplateId, eventTemplate).then((success) => {
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
  postProcessing: string = "";
}
