import {Component, ViewChild} from '@angular/core';
import {NgForm } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DayEvent} from "../../../shared/event";
import {ToastrService} from "ngx-toastr";
import {DayService} from "../../../shared/days.service";
import {Day} from "../../../shared/day";
import * as uuid from 'uuid';

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
  dayDate: Date;
  day: Day;
  type: string;


  constructor(private router: Router, private route: ActivatedRoute, private dayService: DayService, private toastr: ToastrService) {
    this.dayId = this.route.snapshot.params['day'];
    this.type = this.route.snapshot.params['type'];
    this.getDayById();
  }

  async getDayById() {
    console.log("this.dayId" + this.dayId);
    console.log("this.type" + this.type);
    this.day = await this.dayService.get(this.dayId);
    this.dayDate = this.day.day.toDate();
  }

  addEvent(isValid: any) {
    this.isSubmitted = true;

    if (isValid) {
      console.log(this.dayDate);
      let startDate: Date = new Date(this.dayDate);

      let [hours, minutes] = this.addEventForm.startTime.split(':');
      startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      let endDate: Date = new Date(this.dayDate);
      [hours, minutes] = this.addEventForm.endTime.split(':');
      endDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      let event: DayEvent = {
        id: uuid.v4(),
        startTime: startDate,
        endTime: endDate,
        name: this.addEventForm.name,
        categories: this.addEventForm.categories,
        type: this.type,
        day: this.dayId,
      }

      console.log(event);
      if (this.type === 'optional') {
        if (!this.day.optionalEvents) {
          this.day.optionalEvents = [];
        }
        this.day.optionalEvents.push(event);
      } else {
        if (!this.day.optionalEvents) {
          this.day.optionalEvents = [];
        }
        this.day.resultEvents.push(event);
      }
      this.dayService.update(this.dayId, this.day);
      setTimeout(() => {
        this.router.navigate(['days', this.dayId, 'events']);
      }, 500);
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

