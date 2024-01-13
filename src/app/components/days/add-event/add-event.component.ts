import {Component, ViewChild} from '@angular/core';
import {NgForm } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DayEvent} from "../../../shared/model/event";
import {ToastrService} from "ngx-toastr";
import {DayService} from "../../../shared/services/days.service";
import {Day} from "../../../shared/model/day";
import * as uuid from 'uuid';
import {GeneratorService} from "../../../shared/services/plan-generator.service";

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


  constructor(private router: Router, private route: ActivatedRoute, private dayService: DayService, private toastr: ToastrService,
              private generatorService: GeneratorService) {
    this.dayId = this.route.snapshot.params['day'];
    this.type = this.route.snapshot.params['type'];
    this.getDayById();
  }

  async getDayById() {
    this.dayService.dayList.subscribe((days: Day[]) => {
      this.day = days.find((day) => day.id === this.dayId);
    })
    this.dayDate = this.day.dayDate;
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

      if (this.type === 'optional') {
        if (!this.day.optionalEvents) {
          this.day.optionalEvents = [];
        }
        this.day.optionalEvents.push(event);
        this.dayService.updateById(this.day);
        this.generatorService.addEvents(7);
      } else {
        if (!this.day.optionalEvents) {
          this.day.optionalEvents = [];
        }
        this.day.resultEvents.push(event);
      }
      this.dayService.updateById(this.day);
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

