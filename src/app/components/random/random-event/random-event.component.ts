import {Component, OnInit} from '@angular/core';
import {EventTemplate} from "../../../shared/model/event-template";
import {EventTemplateService} from "../../../shared/services/event-template.service";
import {Category} from "../../../shared/category";

@Component({
  selector: 'app-random-event',
  templateUrl: './random-event.component.html',
  styleUrls: ['./random-event.component.scss']
})
export class RandomEventComponent  implements OnInit {

  eventTemplateList: EventTemplate[] = [];
  selectCategoryOptions = Object.keys(Category);
  selectedCategory: string = '';
  selectedEventTemplate: string = '';
  generatedNumber: number | null = null;

  constructor(public eventTemplateService: EventTemplateService) { }

  ngOnInit(): void {
    this.eventTemplateService.eventTemplateListSubject.subscribe((eventTemplateList: EventTemplate[]) => {
      this.eventTemplateList = eventTemplateList;
      console.log(this.eventTemplateList);
    })
  }

  generateNumber() {
    this.generatedNumber = Math.floor(Math.random() * 9) + 1;
  }

  generateEvent() {
    const filteredEventTemplateList = this.eventTemplateList
      .filter((eventTemplate) => eventTemplate.category === this.selectedCategory.toLowerCase());
    console.log(filteredEventTemplateList);

    const totalWeight = filteredEventTemplateList
      .reduce((sum, eventTemplate) => sum + eventTemplate.weight, 0);

    if (totalWeight && totalWeight > 0) {
        const randomNumber  = Math.floor(Math.random() * totalWeight);
        let cumulativeWeight = 0;

        for (const eventTemplate of filteredEventTemplateList) {
          cumulativeWeight += eventTemplate.weight;

          if (randomNumber < cumulativeWeight) {
            console.log(eventTemplate.weight);

            this.selectedEventTemplate = eventTemplate.name;
            break;
            }

          }
        }
  }
}
