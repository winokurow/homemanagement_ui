import {Component, OnInit} from '@angular/core';
import {EventTemplateService} from "../../../shared/event-template.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Type} from "ng-mocks";
import {map} from "rxjs/operators";
import {EventTemplate} from "../../../shared/event-template";
import {Category} from "../../../shared/category";

@Component({
  selector: 'ng-modal-confirm',
  template: `
  <div class="modal-header">
    <h5 class="modal-title" id="modal-title">Delete Confirmation</h5>
    <button type="button" class="btn close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">×</span>
    </button>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete?</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">CANCEL</button>
    <button type="button" ngbAutofocus class="btn btn-success" (click)="modal.close('Ok click')">OK</button>
  </div>
  `,
})
export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}
const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-event-template-list',
  templateUrl: './event-template-list.component.html',
  styleUrls: ['./event-template-list.component.scss']
})
export class EventTemplateListComponent implements OnInit {

  closeResult = '';
  selectCategoryOptions = Object.keys(Category);
  selectedCategory: string = '';
  eventTemplateList: EventTemplate[] = [];
  constructor(private router: Router, private route: ActivatedRoute, private modalService: NgbModal,
              private toastr: ToastrService, private eventTemplateService: EventTemplateService) {
    if (this.route.snapshot.params['category']) {
      this.selectedCategory = this.route.snapshot.params['category'];
    } else {
      this.selectedCategory = "";
    }
  }

  ngOnInit(): void {
    this.getAllEventTemplate();
  }
  async getAllEventTemplate() {
    this.eventTemplateService.getAll(this.selectedCategory).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)

      data = data.sort((a, b) => {
        const aHas = typeof a.order !== 'undefined';
        const bHas = typeof b.order !== 'undefined';
        return aHas ? bHas ? a.order - b.order : 1 : -1
        }
      );
      console.log(data)
      this.eventTemplateList = data;
    });
  }

  AddEventTemplate() {
    this.router.navigate(['add-event-template/', this.selectedCategory]);
  }

  deleteEventTemplateConfirmation(eventTemplate: any) {
    this.modalService.open(MODALS['deleteModal'],
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result) => {
        this.deleteEventTemplate(eventTemplate);
      },
      (reason) => {});
  }

  deleteEventTemplate(eventTemplate: any) {
    this.eventTemplateService.delete(eventTemplate.id).then((success) => {
      this.toastr.success("Deleted");
    })
  }

  changeCategory() {
    this.getAllEventTemplate();
  }
}

