import {Injectable} from '@angular/core';
import {Day} from "./day";
import {ToastrService} from "ngx-toastr";
import {DayService} from "./days.service";
import {first, map, take} from "rxjs/operators";
import {EventService} from "./event.service";
import {DayEvent} from "./event";
import {Category} from "./category";
import {categoryCoefficient} from "./category-coefficient";
import {EventTemplateService} from "./event-template.service";
import {EventTemplate} from "./event-template";
import { Timestamp } from "@firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {


  private necessaryCounter = 0;

  constructor(private toastr: ToastrService, private dayService: DayService, private eventService: EventService,
    private eventTemplateService:EventTemplateService) {
  }

  generateDaysAfterToday(numberOfDays: number) {
    const nextDays = this.calculateDatesForNextDays(numberOfDays);
    for (const dayDate of nextDays) {
      this.dayService.getByDay(dayDate).pipe(first()).subscribe(queryResult => {
        if (!queryResult) {
          const day: Day = {
            day: dayDate,
            state: 'created',
            resultEvents: [], // Initialize with an empty array of DayEvent
          };

          this.dayService.create(day);

          this.output(`Added Day for ${dayDate}`);
        } else {
          this.output(`Day for ${dayDate} already exists.`);
        }
      })
    }
  }

  async generate(dayId: string) {
    this.necessaryCounter = 0;
    let events = await this.eventService.getEventsForDate(dayId).toPromise();
    this.output('START GENERATION------------------');
    this.output('result events');
    this.output(events);
    const day = await this.dayService.get(dayId);
    this.output('Day Events');
    this.output(JSON.parse(JSON.stringify(day.resultEvents)));

    let weights = await this.getWeights(day.day.toDate());
    let weightedCategories = this.getWeightedCategories(weights);
    this.output('weighted categories:');
    this.output(JSON.parse(JSON.stringify(day.resultEvents)));
    this.output(weightedCategories);


    const optionalEvents: DayEvent[] = events.filter((event) => event.type === 'optional');
    this.output('optionalEvents');
    this.output(optionalEvents);

    //add Optional Events
    if (optionalEvents.length>0) {
      this.addOptionalEvent(day, optionalEvents, weights);
    }


    let gap = this.findGapBetweenEvents(day);

    let eventTemplates: EventTemplate[] = await this.eventTemplateService.getAll('').snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({id: c.payload.doc.id, ...c.payload.doc.data()})
        )
      )
    ).pipe(
      take(1),
    ).toPromise();

    while (gap) {
      this.output('Gap:');
      this.output(gap[0].toLocaleTimeString());
      this.output(gap[1].toLocaleTimeString());
      this.output('weighted categories:');
      this.output(weightedCategories);

      let newEvent = this.findEventTemplate(day, eventTemplates, gap, weightedCategories, this.necessaryCounter);
      let categoriesMap = this.parseCategoriesCSV(newEvent.categories);
      weights = this.updateWeights(weights, categoriesMap);
      weightedCategories = this.getWeightedCategories(weights);
      this.output("Add event");
      this.output(newEvent);
      if (newEvent.postprocess === 'WHOLE_DAY') {
        day.resultEvents = [];
      }
      day.resultEvents.push(newEvent);
      gap = this.findGapBetweenEvents(day);
    }
    this.output(day.resultEvents);
    await this.dayService.update(day.id, day);

  }

  private findEventTemplate(day: Day, eventTemplates: EventTemplate[], gap: [Date, Date], weightedCategories: [string,number][], necessaryCounter: number) : DayEvent {
    let duration = this.calculateDurationInMinutes(gap[0], gap[1]);
    this.output('duration:');
    this.output(duration);

    // Try to find necessary event
    console.log("Try to find necessary event")
    this.output(eventTemplates);
    let filteredNecessaryEventTemplateList: EventTemplate[] = eventTemplates.filter((eventTemplates) => eventTemplates.category === Category.NECESSARY.toLowerCase());
    this.output(filteredNecessaryEventTemplateList);
    filteredNecessaryEventTemplateList.sort((a, b) => a.order - b.order);

    if (filteredNecessaryEventTemplateList[necessaryCounter].duration <= duration) {
      let categoriesMap = this.parseCategoriesCSV(filteredNecessaryEventTemplateList[necessaryCounter].categories);
      const eventKeyValueArray = Array.from(categoriesMap);
      const eventTemplateCategories = eventKeyValueArray.map((item) => item[0]);
      this.output(weightedCategories[0][0])
      this.output(eventTemplateCategories);
      if (categoriesMap.get(weightedCategories[0][0])>0) {
        let endTime = new Date(gap[0]);
        endTime.setMinutes(endTime.getMinutes() + filteredNecessaryEventTemplateList[necessaryCounter].duration);
        let newEvent: DayEvent = {
          userId: filteredNecessaryEventTemplateList[necessaryCounter].userId,
          startTime: Timestamp.fromDate(new Date(gap[0])),
          endTime: Timestamp.fromDate(endTime),
          name: filteredNecessaryEventTemplateList[necessaryCounter].name,
          categories: filteredNecessaryEventTemplateList[necessaryCounter].categories,
          type: 'generated',
          day: day.id
        }
        this.necessaryCounter++;
        return newEvent;
      }
    }

    const sortedEventCategories = weightedCategories.map((item) => item[0]);
    for (const category of sortedEventCategories) {

      // Hygiene
      if (category == Category.HYGIENE) {
        console.log("Categorie is hygiene");
        let endTime = new Date(gap[0]);
        endTime.setMinutes(endTime.getMinutes() + 5);
        let newEvent: DayEvent = {
          userId: day.userId,
          startTime: Timestamp.fromDate(new Date(gap[0])),
          endTime: Timestamp.fromDate(endTime),
          name: 'Гигиена',
          categories: 'HYGIENE:5',
          type: 'generated',
          day: day.id
        }
        return(newEvent);
      }

      // Necessary
      if ((category == Category.NECESSARY) && (filteredNecessaryEventTemplateList[necessaryCounter].duration <= duration) ) {
        console.log("Categorie is neccessary");
        let endTime = new Date(gap[0]);
        endTime.setMinutes(endTime.getMinutes() + filteredNecessaryEventTemplateList[necessaryCounter].duration);
        let newEvent: DayEvent = {
          userId: filteredNecessaryEventTemplateList[necessaryCounter].userId,
          startTime: Timestamp.fromDate(new Date(gap[0])),
          endTime: Timestamp.fromDate(endTime),
          name: filteredNecessaryEventTemplateList[necessaryCounter].name,
          categories: filteredNecessaryEventTemplateList[necessaryCounter].categories,
          type: 'generated',
          day: day.id
        }
        this.necessaryCounter++;
        return newEvent;
      }

      let newEvent = this.chooseEventTemplate(category, day, gap[0], duration, eventTemplates);
      if (newEvent != null) {
        return(newEvent);
      }
    }
    return null;
  }
  private updateWeights(weights: Map<string, number>, categoriesMap: Map<string,number>): Map<string,number> {
    for (const [key, value] of categoriesMap) {
      if (weights.has(key)) {
        weights.set(key, weights.get(key)! + value);
      } else {
        weights.set(key, value);
      }
    }
    return weights;
  }
  private chooseEventTemplate(category: String, day: Day, startTime: Date, duration: number, eventTemplates: EventTemplate[]) {
    let newEvent: DayEvent = {
      userId: day.userId,
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(startTime)),
      name: '',
      categories: '',
      type: 'generated',
      day: day.id
    }
    let aggregatedDuration = 0;
    let templatesCount = 0;
    let filteredEventTemplateList = eventTemplates
      .filter((eventTemplate) => eventTemplate.category === category.toLowerCase() && eventTemplate.duration <= duration);
    const totalWeight = filteredEventTemplateList
      .reduce((sum, eventTemplate) => sum + eventTemplate.weight, 0);

    if (totalWeight > 0) {
      while (aggregatedDuration < 5) {
        const randomNumber = Math.floor(Math.random() * totalWeight);
        let cumulativeWeight = 0;

        for (const eventTemplate of filteredEventTemplateList) {

          cumulativeWeight += eventTemplate.weight;

          if (randomNumber < cumulativeWeight) {
            this.output(eventTemplate);
            templatesCount++;
            this.output('eventTemplate.postprocess ' + eventTemplate.postprocess)
            this.output(eventTemplate.postprocess !== undefined)
            if ((eventTemplate.postprocess !== undefined) && (eventTemplate.postprocess !== '')) {
              this.output('postprocessing')
              if (eventTemplate.postprocess == 'WHOLE_DAY') {

                this.dayService.update(day.id, day);
                let beginTime = new Date(day.day.toDate());
                beginTime.setHours(7, 0);
                let endTime = new Date(day.day.toDate());
                endTime.setHours(21, 45);
                newEvent.name += eventTemplate.name;
                newEvent.categories = eventTemplate.categories;
                newEvent.startTime = Timestamp.fromDate(beginTime);
                newEvent.endTime = Timestamp.fromDate(endTime);
                newEvent.postprocess = 'WHOLE_DAY';
                return newEvent;
              }
              let processedEvent = this.chooseEventTemplate(eventTemplate.postprocess, day, startTime, duration, eventTemplates);
              processedEvent.name = eventTemplate.name + ':' + processedEvent.name;
              return processedEvent;
            }

            if (templatesCount > 1) {
              newEvent.name +=  '-----------';
            }
            if (eventTemplate.room) {
              newEvent.name +=  eventTemplate.room;
            }
            newEvent.name += eventTemplate.name;

            newEvent.categories = eventTemplate.categories;
            aggregatedDuration = aggregatedDuration + eventTemplate.duration;
            this.output('aggregatedDuration' + aggregatedDuration);
            break;
          }
        }
      }
    }

    if (aggregatedDuration > 0) {
      aggregatedDuration = Math.round(aggregatedDuration / 5) * 5;
      let endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + aggregatedDuration);
      newEvent.endTime = Timestamp.fromDate(endTime);
      newEvent.startTime = Timestamp.fromDate(startTime);
      if (newEvent.categories === undefined) {
        newEvent.categories = category + ':' + aggregatedDuration;
      }
      return newEvent;
    }
    return null;
  }
  private findGapBetweenEvents(
    day: Day
  ): [Date, Date] | null {
    let beginTime = new Date(day.day.toDate());
    beginTime.setHours(7, 0);
    let endTime = new Date(day.day.toDate());
    endTime.setHours(21, 45);
    let previousEndTime = new Date(beginTime);
    let events = day.resultEvents.sort((a, b) => a.startTime - b.startTime);
    this.output('result events');
    this.output(events);
    for (const event of events) {
      if (event.startTime.toDate() > previousEndTime) {
        return [previousEndTime, event.startTime.toDate()];
      }
      previousEndTime = new Date(event.endTime.toDate());
    }

    if (previousEndTime < endTime) {
      return [previousEndTime, endTime];
    }

    return null;
  }

  private calculateDurationInMinutes(startDate: Date, endDate: Date): number {
    const millisecondsDifference = endDate.getTime() - startDate.getTime();
    // 1000 milliseconds = 1 second, 60 seconds = 1 minute
    return millisecondsDifference / (1000 * 60);
  }

  async addEvents(numberOfDays: number) {
    this.output(numberOfDays);
    const nextDays = this.calculateDatesForNextDays(numberOfDays);
    this.output(nextDays.length);
    for (const dayDate of nextDays) {
      this.output(dayDate);
      let day = await this.dayService.getByDay(dayDate).toPromise();
      if (day !== undefined && day !== null) {
        let events = await this.eventService.getEventsForDate(day.id).toPromise();
        const mandatoryEvents: DayEvent[] = events.filter((event) => event.type === 'mandatory');
        const optionalEvents: DayEvent[] = events.filter((event) => event.type === 'optional');
        this.output('mandatoryEvents');
        this.output(mandatoryEvents);
        this.output('optionalEvents');
        this.output(optionalEvents);
        // Add Mandatory
        for (const event of mandatoryEvents) {
          const doesEventExist = day.resultEvents.some((resultEvent) => {
            return resultEvent.id === event.id
          });
          if (!doesEventExist) {
            // If no event with the same id exists, push the new event into the array
            day.resultEvents.push(event);
          }
        }
        await this.dayService.update(day.id, day);

        // Add Optional
        if (optionalEvents.length>0) {
          let weights = await this.getWeights(dayDate);
          this.addOptionalEvent(day, optionalEvents, weights);
          await this.dayService.update(day.id, day);

        }
      }
    }
  }

  private addOptionalEvent(day: Day, optionalEvents: DayEvent[], weights: Map<string, number>) {

    let weightedCategories = this.getWeightedCategories(weights);
    this.output('weighted categories:');
    this.output(weightedCategories);
    let sortedKeys;
    if (optionalEvents.length>0) {
      sortedKeys = weightedCategories.map((item) => item[0]);
    }

    for (const optionalEvent of optionalEvents) {

      // check if already exists
      const doesEventExist = day.resultEvents.some((resultEvent) => {
        return resultEvent.id === optionalEvent.id;
      });
      if (doesEventExist) {
        this.output('event already exists');
        this.output(optionalEvent.id);
        continue;
      }

      // check if has no overlap
      let hasOverlap = this.checkIfOverlaps(optionalEvent, day.resultEvents);
      if (hasOverlap) {
        this.output('hasOverlap');
        continue;
      }
      let categoriesMap = this.parseCategoriesCSV(optionalEvent.categories);
      const eventKeyValueArray = Array.from(categoriesMap);
      this.output('sortedEventCategories');
      this.output(sortedKeys[0]);
      if (categoriesMap.get(sortedKeys[0]) > 0) {
        this.toastr.success('Add optional event' + optionalEvent.name);
        this.output('Add optional event');
        this.output(optionalEvent);
        day.resultEvents.push(optionalEvent);
        this.output('pushed' + day.resultEvents.length);

        // Merge and sum the values by category
        weights = this.updateWeights(weights, categoriesMap);
        weightedCategories = this.getWeightedCategories(weights)
        this.output('weighted categories:');
        this.output(weightedCategories);
      }
    }
  }
  private async getWeights(dayDate: Date):  Promise<Map<string, number>> {
    const categoryWeightsMap = new Map<string, number>();
    Object.values(Category).forEach((category) => {
      categoryWeightsMap.set(category, 0);
    });
    this.outputMap(categoryWeightsMap);
    let allEvents: DayEvent[] = await this.dayService.getEventsFromPast(dayDate, 10).toPromise();
    for (const event of allEvents) {
      const categoryMap = this.parseCategoriesCSV(event.categories);
      for (const [category, weight] of categoryMap) {
        categoryWeightsMap.set(category, categoryWeightsMap.get(category) + weight);

      }
    }
    this.outputMap(categoryWeightsMap);
    return categoryWeightsMap;
  }

  private getWeightedCategories(weights: Map<string, number>):  [string,number][] {
    const weightedCategoriesMap = new Map<string, number>();
    let weightsSum = 0;
    weights.forEach((v) => {
      weightsSum += v;
    });
    this.output('weightsSum' + weightsSum);

    for (const [key, value] of weights.entries()) {
      const weightsSumForCategory = weightsSum * categoryCoefficient[key];
      const weightsDifferenceForCategory = (value - weightsSumForCategory) / weightsSumForCategory;
      weightedCategoriesMap.set(key, weightsDifferenceForCategory);
    }

    const eventKeyValueArray = Array.from(weightedCategoriesMap);
    eventKeyValueArray.sort((a, b) => a[1] - b[1]);
    return eventKeyValueArray;
  }

  private checkIfOverlaps(newEvent: DayEvent, eventList: DayEvent[]): boolean {
    for (const existingEvent of eventList) {
      if (
        newEvent.startTime >= existingEvent.startTime &&
        newEvent.startTime < existingEvent.endTime
      ) {
        // There's an overlap at the start time
        return true;
      }

      if (
        newEvent.endTime > existingEvent.startTime &&
        newEvent.endTime <= existingEvent.endTime
      ) {
        // There's an overlap at the end time
        return true;
      }

      if (
        newEvent.startTime <= existingEvent.startTime &&
        newEvent.endTime >= existingEvent.endTime
      ) {
        // The new event completely overlaps an existing event
        return true;
      }

    }
    return false;
  }

  private parseCategoriesCSV(categoriesCSV: string): Map<string, number> {
    const categoryMap = new Map<string, number>();
    const categoryArray = categoriesCSV.split(';');

    Object.values(Category).forEach((category) => {
      categoryMap.set(category, 0);
    });
    for (const categoryInfo of categoryArray) {
      const [category, weightStr] = categoryInfo.split(':');
      const weight = parseInt(weightStr);

      if (!isNaN(weight)) {
        categoryMap.set(category, weight);
      }
    }

    return categoryMap;
  }

  private calculateDatesForNextDays(numberOfDays: number) : Date[] {
    const today = new Date();
    const nextDays = [];

    // Calculate dates for the next days
    for (let i = 0; i < numberOfDays; i++) {
      const nextDay = new Date(today);
      nextDay.setHours(0,0,0,0);
      nextDay.setDate(today.getDate() + i);
      nextDays.push(nextDay);
    }
    return nextDays;
  }

  private outputMap(mapp: Map<string, number>) {
    for(let record of mapp) {
      this.output(record[0] + "m: " + record[1] + "s")
    }
  }

  private output(output: any) {
    console.log(JSON.parse(JSON.stringify(output)));
  }
}

