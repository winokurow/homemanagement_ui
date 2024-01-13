import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DayService} from "../../../shared/services/days.service";
import {Day} from "../../../shared/model/day";
import {DeleteConfirmModal} from "../../../shared/components/delete-dialog/delete-confirm.component";
import {RegularEventService} from "../../../shared/services/regular-events.service";
import {DayEvent} from "../../../shared/model/event";
import * as uuid from "uuid";
import {addTimeToDate} from "../../../shared/utils/date-util";
import {GeneratorService} from "../../../shared/services/plan-generator.service";


@Component({
  selector: 'app-day-event-list',
  templateUrl: './day-event-list.component.html',
  styleUrls: ['./day-event-list.component.scss']
})
export class DayEventListComponent implements OnInit {

  dayId: string;
  day: Day;
  regularEvents: DayEvent[] = [];
  selectedRegularEvent: DayEvent | undefined;
  regularOptionalEvents: DayEvent[] = [];
  selectedOptionalRegularEvent: DayEvent | undefined;

  constructor(private router: Router, private route: ActivatedRoute, private modalService: NgbModal,
              private dayService: DayService, private regularEventService: RegularEventService,
              private generatorService: GeneratorService) {

  }

  ngOnInit(): void {
    this.dayId = this.route.snapshot.params['day'];
    this.dayService.dayList.subscribe((days: Day[]) => {
      this.day = days.find((day) => day.id === this.dayId);
      console.log(this.day);
    });
    this.regularEventService.getEvents().subscribe((events) => {
      this.regularEvents = events;
    });
    this.regularEventService.getOptionalEvents().subscribe((events) => {
      this.regularOptionalEvents = events;
    });
  }

  addEvent() {
    this.router.navigate(['days', this.dayId, 'events', 'add', 'type', 'mandatory']);
  }

  addOptionalEvent() {
    this.router.navigate(['days', this.dayId, 'events', 'add', 'type', 'optional']);
  }

  deleteEventConfirmation(event: any) {
    this.modalService.open(DeleteConfirmModal,
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then(() => {
        this.deleteOptionalEvent(event);
      },
      () => {});
  }

  deleteOptionalEvent(eventToDelete: any) {
    this.day.optionalEvents = this.day.optionalEvents.filter(event => eventToDelete.id != event.id);
    this.dayService.updateById(this.day);
  }

  deleteMandatoryEventConfirmation(event: any) {
    this.modalService.open(DeleteConfirmModal,
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then(() => {
        this.deleteMandatoryEvent(event);
      },
      () => {});
  }

  deleteMandatoryEvent(eventToDelete: any) {
    let result = this.day.resultEvents.filter(event => eventToDelete.id != event.id);
    console.log(result);
    this.day.resultEvents = result;
    this.dayService.updateById(this.day);
  }

  clickAddRegularEvent() {
    this.addRegularEvent(this.selectedRegularEvent);
  }


  clickAddOptionalRegularEvent() {
    this.addRegularEvent(this.selectedOptionalRegularEvent);
  }

  addRegularEvent(event: DayEvent) {
    const startDate = addTimeToDate(new Date(event.startTime), new Date(this.day.dayDate));
    const endDate = addTimeToDate(new Date(event.endTime), new Date(this.day.dayDate));
    const newEvent : DayEvent = {
      ...(event),
      id: uuid.v4(),
      userId: this.day.userId,
      startTime: startDate,
      endTime: endDate,
      name: event.name,
      categories: event.categories,
      type: event.type,
      day: this.day.id,
    };
    if (event.type == 'Mandatory') {
      this.day.resultEvents.push(newEvent);
      this.dayService.updateById(this.day);
    } else {
      this.day.optionalEvents.push(newEvent);
      this.dayService.updateById(this.day);
      this.generatorService.addEvents(7);

    }
}
}
