import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {DayService} from "../../../shared/days.service";
import {Day} from "../../../shared/day";
import {DayEvent} from "../../../shared/event";

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
  type: string;
  dayId: string;
  day: Day;
  dayDate: Date;
  isSubmitted: boolean = false;


  constructor(private toastr: ToastrService, private route: ActivatedRoute, private router: Router,
              private dayService: DayService) { }

  async ngOnInit(): Promise<void> {
    this.eventId = this.route.snapshot.params['id'];
    this.dayId = this.route.snapshot.params['day'];
    this.type = this.route.snapshot.params['type'];
    this.day = await this.dayService.get(this.dayId);
    this.dayDate = this.day.day.toDate();
    this.getEventById();
  }

  getEventById() {
    let dayEvent : DayEvent;
    console.log(this.day);
    if (this.type === 'optional') {
      dayEvent = this.day.optionalEvents.find((event) => event.id === this.eventId);
    } else {
      dayEvent = this.day.resultEvents.find((event) => event.id === this.eventId);
    }

      this.editEventForm.startTime = dayEvent.startTime.toDate().toLocaleTimeString();
      this.editEventForm.endTime = dayEvent.endTime.toDate().toLocaleTimeString();
      this.editEventForm.day = dayEvent.day;
      this.editEventForm.type = dayEvent.type;
      this.editEventForm.name = dayEvent.name;
      this.editEventForm.day = dayEvent.day;
      this.editEventForm.categories = dayEvent.categories;
  }

  editEvent(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      const eventTemplate = this.editEventForm;
      let startDate: Date = new Date(this.dayDate);
      let [hours, minutes] = (this.editEventForm.startTime as string).split(':');
      startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      let endDate: Date = new Date(this.dayDate);
      [hours, minutes] = (this.editEventForm.endTime as string).split(':');
      endDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      eventTemplate.startTime = startDate;
      eventTemplate.endTime = endDate;
      //eventTemplate.id = this.eventTemplateId
      if (this.type == 'optional') {
        const index = this.day.optionalEvents.findIndex(event => event.id === this.eventId);

        if (index !== -1) {
          // If the DayEvent with the given id is found, replace it with the newDayEvent
          this.day.optionalEvents[index].startTime = eventTemplate.startTime;
          this.day.optionalEvents[index].endTime = eventTemplate.endTime;
          this.day.optionalEvents[index].name = eventTemplate.name;
          this.day.optionalEvents[index].categories = eventTemplate.categories;
        }
      } else {
        const index = this.day.resultEvents.findIndex(event => event.id === this.eventId);

        if (index !== -1) {
          // If the DayEvent with the given id is found, replace it with the newDayEvent
          this.day.resultEvents[index].startTime = eventTemplate.startTime;
          this.day.resultEvents[index].endTime = eventTemplate.endTime;
          this.day.resultEvents[index].name = eventTemplate.name;
          this.day.resultEvents[index].categories = eventTemplate.categories;
        }
      }
      this.dayService.update(this.day.id, this.day);
      this.router.navigate(['days', this.editEventForm.day, 'events']);
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
