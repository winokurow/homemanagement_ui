import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {Day} from "../../../shared/day";
import {DayService} from "../../../shared/days.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-days-list',
  templateUrl: './days-list.component.html',
  styleUrls: ['./days-list.component.scss']
})
export class DaysListComponent  implements OnInit {
  newDayDate: Date;
  days: Map<Date, Day> = new Map();

  constructor(private toastr: ToastrService, private dayService: DayService) {
  }

  ngOnInit(): void {
    this.getAllDays();
  }

  async getAllDays() {
    this.dayService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.days = new Map(data.map(element => [element.day, element]));
    });
  }

  addDay() {
    if (this.newDayDate) {
      if (!(this.days.has(this.newDayDate))) {
        const day = {
          day: this.newDayDate,
          mandatoryEvents: [],
          optionalEvents: [],
          resultEvents: []
        }
        this.dayService.create(day).then(() => {
          this.toastr.success('success');
          this.getAllDays();
        })
          .catch((error: any) => {
            console.log(error);
          });
      } else {
        this.toastr.success('Date already exists');
      }
    }
  }


}
