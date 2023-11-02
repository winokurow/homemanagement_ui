import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Type} from "ng-mocks";
import {NgModalConfirm} from "../../event-template/event-template-list/event-template-list.component";
import {EventService} from "../../../shared/event.service";
import {map} from "rxjs/operators";
import {DayEvent} from "../../../shared/event";
import firebase from "firebase/compat";


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
  eventList: DayEvent[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private modalService: NgbModal,
              private toastr: ToastrService, private eventService: EventService) {
  }

  ngOnInit(): void {
    this.dayId = this.route.snapshot.params['day'];
    this.getAllEvents();
  }
  async getAllEvents() {
    this.eventService.getAll(this.dayId).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        this.eventList = data;
      });
  }

  addMandatoryEvent() {
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
        this.deleteEvent(event);
      },
      (reason) => {});
  }

  deleteEvent(event: any) {
    this.eventService.delete(event.id).then((success) => {
      this.toastr.success("Deleted");
    })
  }

}
