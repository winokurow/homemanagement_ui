import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {Day} from "../../../shared/model/day";
import {DayService} from "../../../shared/days.service";
import {map} from "rxjs/operators";
import {GeneratorService} from "../../../shared/plan-generator.service";
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

  constructor(private toastr: ToastrService, private dayService: DayService, private generatorService: GeneratorService) {
  }

  ngOnInit(): void {
    this.getAllDays();
  }

  async getAllDays() {
    this.dayService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id,...c.payload.doc.data()
          })
        )

  )
    ).subscribe(data => {
      this.days = data.sort((a, b) => b.day - a.day);
      console.log(this.days);
    });
  }

  addDays() {
    this.generatorService.generateDaysAfterToday(7);
  }

  addEvents() {
    this.generatorService.addEvents(7);
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

  async delete(day: Day) {
    day.resultEvents = [];
    await this.dayService.update(day.id, day);
  }
}
