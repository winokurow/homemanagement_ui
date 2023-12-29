import {Component, OnInit} from '@angular/core';
import {Day} from "../../../shared/model/day";
import {DayService} from "../../../shared/services/days.service";
import {GeneratorService} from "../../../shared/services/plan-generator.service";
import {DayEvent} from "../../../shared/model/event";

@Component({
  selector: 'app-days-list',
  templateUrl: './days-list.component.html',
  styleUrls: ['./days-list.component.scss']
})
export class DaysListComponent  implements OnInit {
  days: Day[] = [];
  events: DayEvent[] = [];
  displayStyle = 'none';
  stateColors: { [key: string]: string } = {
    'events_inserted': ' #f1e16e',
    'generated': ' #99ff33'
  };

  constructor(public dayService: DayService, private generatorService: GeneratorService) {
  }

  ngOnInit(): void {
    this.dayService.dayList.subscribe((days: Day[]) => {
      this.days = days;
    })
  }

  addDays() {
    this.generatorService.generateDaysAfterToday(7);
  }

  generate(day:Day) {
    this.generatorService.generate(day);
  }

  show(day:Day) {
    this.events = day.resultEvents;
    this.openPopup();
  }

  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

  delete(day: Day) {
    day.resultEvents = [];
    this.dayService.updateById(day);
  }
}
