import {Component, ViewChild} from '@angular/core';
import {NgForm } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DayEvent} from "../../../shared/event";
import {ToastrService} from "ngx-toastr";
import {EventService} from "../../../shared/event.service";
import {DayService} from "../../../shared/days.service";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent {

  addEventForm: eventForm = new eventForm();

  @ViewChild("eventTemplateForm")
  eventTemplateForm!: NgForm;
  isSubmitted: boolean = false;

  dayId: string;
  day: Date;
  type: string;


  constructor(private router: Router, private route: ActivatedRoute, private dayService: DayService, private eventService: EventService, private toastr: ToastrService,) {
    this.dayId = this.route.snapshot.params['day'];
    this.type = this.route.snapshot.params['type'];
    this.getDayById();
  }

  async getDayById() {
    console.log("this.dayId"+this.dayId);
    console.log("this.type"+this.type);
    const getDay = await this.dayService.get(this.dayId);
    this.day = getDay.day.toDate();
  }

  addEvent(isValid: any) {
    this.isSubmitted = true;

    if (isValid) {
      console.log(this.day);
      let startDate : Date = new Date(this.day);

      let [hours, minutes] = this.addEventForm.startTime.split(':');
      startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      let endDate : Date = new Date(this.day);
      [hours, minutes] = this.addEventForm.endTime.split(':');
      endDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      let event:DayEvent = {
        startTime: startDate,
        endTime: endDate,
        name: this.addEventForm.name,
        categories: this.addEventForm.categories,
        type: this.type,
        day: this.dayId,
      }
      console.log(event);

      this.eventService.create(event).then((success) => {
        this.toastr.success('success');
        setTimeout(() => {
          this.router.navigate(['days', this.dayId, 'events']);
        }, 500);
      })
        .catch((error: any) => {
        console.log(error);
      });
    }
  }
}

export class eventForm {
  startTime: string;
  endTime: string;
  day: string = "";
  type: string = "";
  name: string = "";
  categories: string = "";
}

