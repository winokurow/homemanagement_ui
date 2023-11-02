import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {EventService} from "../../../shared/event.service";
import {DayService} from "../../../shared/days.service";

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
  day: Date;
  isSubmitted: boolean = false;


  constructor(private toastr: ToastrService, private route: ActivatedRoute, private router: Router,
              private dayService: DayService, private eventService: EventService) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    this.getEventById();
  }

  async getDayById() {
    console.log(this.editEventForm.day)
    const getDay = await this.dayService.get(this.editEventForm.day);
    this.day = getDay.day.toDate();
  }

  getEventById() {
    this.eventService.get(this.eventId)
    .subscribe((data: any) => {

      this.editEventForm.startTime = data.data().startTime.toDate().toLocaleTimeString();
      this.editEventForm.endTime = data.data().endTime.toDate().toLocaleTimeString();
      this.editEventForm.day = data.data().day;
      this.editEventForm.type = data.data().type;
      this.editEventForm.name = data.data().name;
      this.editEventForm.day = data.data().day;
      this.editEventForm.categories = data.data().categories;
      this.getDayById();
      },
      (error: any) => { });
  }

  editEvent(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      const eventTemplate = this.editEventForm;
      let startDate : Date = new Date(this.day);
      let [hours, minutes] = (this.editEventForm.startTime as string).split(':');
      startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      let endDate : Date = new Date(this.day);
      [hours, minutes] = (this.editEventForm.endTime as string).split(':');
      endDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      eventTemplate.startTime = startDate;
      eventTemplate.endTime = endDate;
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
  startTime: string | Date;
  endTime: string | Date;
  day: string = "";
  type: string = "";
  name: string = "";
  categories: string = "";
}
