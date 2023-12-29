import { Pipe, PipeTransform } from '@angular/core';
import {EventTemplate} from "../../../shared/model/event-template";

@Pipe({
  name: 'categoriesFilterPipe'
})
export class CategoriesFilterPipePipe implements PipeTransform {

  transform(eventTemplateList: EventTemplate[], category: String): EventTemplate[] {
    return eventTemplateList.filter(t => (category === '') || (t.category === category.toLowerCase()))
      .sort((a, b) => {
      return a.order > b.order ? 1 : -1;
    });;
  }

}
