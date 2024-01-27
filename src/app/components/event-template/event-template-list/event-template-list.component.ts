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

  // Sorting function
  customSort = (a: EventTemplate, b: EventTemplate): number => {
    if (a.creationDate && b.creationDate) {
      // If both objects have date, sort by date
      return a.creationDate.getTime() - b.creationDate.getTime();
    } else if (a.creationDate) {
      // If only a has date, it comes first
      return -1;
    } else if (b.creationDate) {
      // If only b has date, it comes first
      return 1;
    } else {
      // If neither has date, sort by name
      return a.name.localeCompare(b.name);
    }
  };


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

