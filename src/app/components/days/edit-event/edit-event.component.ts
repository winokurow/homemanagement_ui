import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {EventService} from "../../../shared/event.service";

@Component({
  selector: 'app-edit-event-template',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  editEventForm: eventForm = new eventForm();

  @ViewChild("eventForm")
  eventForm!: NgForm;
  eventId: string;

  isSubmitted: boolean = false;


  constructor(private toastr: ToastrService, private route: ActivatedRoute, private router: Router,
     private eventService: EventService) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    this.getEventById();
  }
  getEventById() {
    this.eventService.get(this.eventId)
    .subscribe((data: any) => {
      this.editEventForm.startTime = data.data().startTime;
      this.editEventForm.endTime = data.data().endTime;
      this.editEventForm.day = data.data().day;
      this.editEventForm.type = data.data().type;
      this.editEventForm.name = data.data().name;
      this.editEventForm.day = data.data().day;
      this.editEventForm.categories = data.data().categories;
      },
      (error: any) => { });
  }

  editEvent(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {

      const eventTemplate = this.editEventForm
      //eventTemplate.id = this.eventTemplateId
      this.eventService.update(this.eventId, eventTemplate).then((success) => {
        this.toastr.success('success');
        setTimeout(() => {
          this.router.navigate(['days', this.editEventForm.day, 'events']);
        }, 500);
      })
        .catch(error => {
          console.log(error);
        });
    }
  }
}

export class eventForm {
  startTime: Date;
  endTime: Date;
  day: string = "";
  type: string = "";
  name: string = "";
  categories: string = "";
}
