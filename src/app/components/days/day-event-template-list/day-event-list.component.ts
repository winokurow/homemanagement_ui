import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Type} from "ng-mocks";
import {NgModalConfirm} from "../../event-template/event-template-list/event-template-list.component";
import {DayService} from "../../../shared/days.service";
import {Day} from "../../../shared/day";


const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-day-event-list',
  templateUrl: './day-event-list.component.html',
  styleUrls: ['./day-event-list.component.scss']
})
export class DayEventListComponent implements OnInit {

  dayId: string;
  day:Day;

  constructor(private router: Router, private route: ActivatedRoute, private modalService: NgbModal,
              private toastr: ToastrService, private dayService: DayService) {

  }

  ngOnInit(): void {
    this.dayId = this.route.snapshot.params['day'];
    this.getDay();
  }

  async getDay() {
    this.day = await this.dayService.get(this.dayId);
    console.log(this.day);
  }
  addEvent() {
    this.router.navigate(['days', this.dayId, 'events', 'add', 'type', 'mandatory']);
  }

  addOptionalEvent() {
    this.router.navigate(['days', this.dayId, 'events', 'add', 'type', 'optional']);
  }

  deleteEventConfirmation(event: any) {
    this.modalService.open(MODALS['deleteModal'],
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result) => {
        this.deleteOptionalEvent(event);
      },
      (reason) => {});
  }

  deleteOptionalEvent(event: any) {
    this.day.optionalEvents = this.day.optionalEvents.filter(event => !event.id);
    this.dayService.update(this.day.id, this.day);
  }

  deleteMandatoryEventConfirmation(event: any) {
    this.modalService.open(MODALS['deleteModal'],
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result) => {
        this.deleteMandatoryEvent(event);
      },
      (reason) => {});
  }

  deleteMandatoryEvent(event: any) {
    this.day.resultEvents = this.day.resultEvents.filter(event => !event.id);
    this.dayService.update(this.day.id, this.day);
  }

}
