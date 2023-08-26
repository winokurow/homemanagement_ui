import { Component, OnInit } from '@angular/core';
import {EventTemplateService} from "../../shared/eventtemplate.service";
import {ToastrService} from "ngx-toastr";
import { EventTemplate } from '../../shared/event-template';

@Component({
  selector: 'app-event-template-list',
  templateUrl: './event-template-list.component.html',
  styleUrls: ['./event-template-list.component.scss']
})
export class EventTemplateListComponent  implements OnInit {
  p: number = 1;
  eventTemplates: EventTemplate[];
  hideWhenNoEventTemplate: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;

  constructor(
    public crudApi: EventTemplateService,
    public toastr: ToastrService
  ){ }

  ngOnInit() {
    this.dataState();
    let s = this.crudApi.getAll();
  }
  dataState() {
    this.crudApi.getAll();
  }
  deleteEventTemplate(eventTemplate) {
    if (window.confirm('Are sure you want to delete this eventTemplate ?')) {
      this.crudApi.delete(eventTemplate.$key)
      this.toastr.success(eventTemplate.firstName + ' successfully deleted!');
    }
  }


}
