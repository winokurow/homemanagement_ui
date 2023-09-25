import {Component, ViewChild} from '@angular/core';
import {NgForm } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Day} from "../../../shared/day";
import {DayEvent} from "../../../shared/event";
import {ToastrService} from "ngx-toastr";
import {EventService} from "../../../shared/event.service";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent {

  addEventForm: DayEvent = new eventForm();

  @ViewChild("eventTemplateForm")
  eventTemplateForm!: NgForm;
  isSubmitted: boolean = false;

  dayId: string;
  type: string;


  constructor(private router: Router, private route: ActivatedRoute, private eventService: EventService, private toastr: ToastrService,) {
    this.dayId = this.route.snapshot.params['day'];
    this.type = this.route.snapshot.params['type'];
  }

  addEvent(isValid: any) {
    this.isSubmitted = true;

    if (isValid) {
      let event:DayEvent = {
        startTime: this.addEventForm.startTime,
        endTime: this.addEventForm.endTime,
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
  startTime: Date;
  endTime: Date;
  day: string = "";
  type: string = "";
  name: string = "";
  categories: string = "";
}

