import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'customSort'
})
export class CustomSortPipe implements PipeTransform {
  transform(array: any[]): any[] {
    if (!Array.isArray(array)) {
      return array;
    }

    const sortedArray = array.slice().sort((a, b) => {
      if (a["order"] && b["order"] && a["order"]!=b["order"]) {
        return a["order"] - b["order"];
      } else if (a["order"]) {
        return -1;
      } else if (b["order"]) {
        return 1;
      }

      if (a["creationDate"] && b["creationDate"]) {
        return new Date(a["creationDate"]).getTime() - new Date(b["creationDate"]).getTime();
      } else if (a["creationDate"]) {
        return -1;
      } else if (b["creationDate"]) {
        return 1;
      }

      return a["name"].localeCompare(b["name"]);
    });

    return sortedArray;
  }
}
