import {Component} from '@angular/core';
import {EventTemplateService} from "../../../shared/services/event-template.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EventTemplate} from "../../../shared/model/event-template";
import {Category} from "../../../shared/category";
import {DeleteConfirmModal} from "../../../shared/components/delete-dialog/delete-confirm.component";




@Component({
  selector: 'app-event-template-list',
  templateUrl: './event-template-list.component.html',
  styleUrls: ['./event-template-list.component.scss']
})
export class EventTemplateListComponent {

  selectCategoryOptions = Object.keys(Category);
  selectedCategory: string = '';
  eventTemplateList: EventTemplate[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private modalService: NgbModal,
              public eventTemplateService: EventTemplateService) {
    if (this.route.snapshot.params['category']) {
      this.selectedCategory = this.route.snapshot.params['category'].toUpperCase();
    } else {
      this.selectedCategory = "";
    }
    console.log("this.selectedCategory" + this.selectedCategory);
  }

  clickAddEventTemplate() {
    this.router.navigate(['add-event-template/', this.selectedCategory]);
  }

  deleteEventTemplateConfirmation(eventTemplate: any) {
    this.modalService.open(DeleteConfirmModal,
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then(() => {
        this.deleteEventTemplate(eventTemplate);
      },
      () => {});
  }

  deleteEventTemplate(eventTemplate: any) {
    this.eventTemplateService.deleteById(eventTemplate.id);
  }
}

