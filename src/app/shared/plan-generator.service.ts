import {Injectable} from '@angular/core';
import {Day} from "./model/day";
import {ToastrService} from "ngx-toastr";
import {DayService} from "./days.service";
import {first, map, take} from "rxjs/operators";
import {DayEvent} from "./model/event";
import {Category} from "./category";
import {categoryCoefficient} from "./category-coefficient";
import {EventTemplateService} from "./event-template.service";
import {EventTemplate} from "./model/event-template";
import {Timestamp} from "@firebase/firestore";
import * as uuid from 'uuid';
import {calculateDatesForNextDays, calculateDurationInMinutes, dayBegin, dayEnd} from "./utils/date-util";
import {Gap} from "./model/gap";

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  FIVE_MINUTES = 5;
  WHOLE_DAY_POSTPROCESS = 'WHOLE_DAY';

  private necessaryCounter = 0;

  constructor(private toastr: ToastrService, private dayService: DayService,
              private eventTemplateService: EventTemplateService) {
  }

  generateDaysAfterToday(numberOfDays: number) {
    const nextDays = calculateDatesForNextDays(numberOfDays);
    for (const dayDate of nextDays) {
      this.checkIfDayNotExistsAndThenInsertDay(dayDate);
    }
  }

  private checkIfDayNotExistsAndThenInsertDay(dayDate: Date) {
    this.dayService.getByDay(dayDate)
      .pipe(first())
      .subscribe(
        queryResult => this.insertDay(queryResult, dayDate),
        error => this.handleError(error)
      );
  }

  private insertDay(queryResult: Day, dayDate: Date) {
    if (!queryResult) {
      const day: Day = {
        day: dayDate,
        optionalEvents: [],
        resultEvents: [],
      };

      this.dayService.create(day)
        .then(() => this.output(`Added Day for ${dayDate}`))
        .catch((error: any) => this.handleError(error));
    }
  }


  async generate(day: Day) {
    try {
      this.output('START GENERATION------------------');
      this.necessaryCounter = 0;
      let weights = await this.getWeights(day.day.toDate());
      let weightedCategories = this.getWeightedCategories(weights, categoryCoefficient);
      this.output(JSON.parse(JSON.stringify(day.resultEvents)));

      //add Optional Events
      this.addOptionalEvents(day, weights);

      let gap = this.findGapBetweenEvents(day);
      this.output(gap);
      let eventTemplates = await this.getEventTemplates();

      while (gap) {
        this.output('Gap:');
        this.output(gap.start.toLocaleTimeString());
        this.output(gap.end.toLocaleTimeString());

        let newEvent = this.findEventTemplateAndGenerateEvent(day, eventTemplates, gap, weightedCategories);
        weights = this.updateWeights(weights, this.parseCategoriesCSV(newEvent.categories));
        weightedCategories = this.getWeightedCategories(weights, categoryCoefficient);
        this.output(weightedCategories);
        if (newEvent.postprocess === this.WHOLE_DAY_POSTPROCESS) {
          day.resultEvents = [];
        }
        this.output("Add event");
        this.output(newEvent);

        day.resultEvents.push(newEvent);
        gap = this.findGapBetweenEvents(day);
      }
      this.output(day.resultEvents);
      await this.dayService.update(day.id, day);
    } catch (error) {
        this.handleError(error);
      }
  }

  private async getEventTemplates(): Promise<EventTemplate[]> {
    return this.eventTemplateService.getAll('').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }))
      )
    ).pipe(
      take(1),
    ).toPromise();
  }

  private findEventTemplateAndGenerateEvent(day: Day, eventTemplates: EventTemplate[], gap: Gap, weightedCategories: [string, number][]): DayEvent | undefined {
    try {
    this.output('duration:');
    this.output(gap.duration);

    // Try to find necessary event
    console.log("Try to find necessary event")
    this.output(eventTemplates);

    let necessaryEvent = this.generateNecessaryEvent(day, gap, weightedCategories, eventTemplates);
    if (necessaryEvent) {
      return necessaryEvent;
    }

    // Generate events for specific categories
    const sortedEventCategories = weightedCategories.map((item) => item[0]);
    for (const category of sortedEventCategories) {
      this.output("Category " + category);

      let newEvent = this.generateEventForCategories(category, day, gap, eventTemplates);
      if (newEvent) {
        return newEvent;
      }
    }
      return null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  private generateEventForCategories(category: string, day: Day, gap: Gap, eventTemplates: EventTemplate[]): DayEvent | undefined {
    // Hygiene, Family, People
    if (category === Category.HYGIENE || category === Category.FAMILY || category === Category.PEOPLE) {
      let endTime = new Date(gap.start);
      endTime.setMinutes(endTime.getMinutes() + this.FIVE_MINUTES);

      return {
        id: uuid.v4(),
        userId: day.userId,
        startTime: Timestamp.fromDate(new Date(gap.start)),
        endTime: Timestamp.fromDate(endTime),
        name: category,
        categories: `${category}:5`,
        type: 'generated',
        day: day.id
      };
    }

    // Necessary
    if (category === Category.NECESSARY) {
      return this.generateNecessaryEvent(day, gap, [[category, 1]], eventTemplates);
    }

    // Other categories
    return this.chooseEventTemplate(category, day, gap, eventTemplates);
  }

  private generateNecessaryEvent(day: Day, gap: Gap, weightedCategories: [string, number][], eventTemplates: EventTemplate[]): DayEvent | undefined {


    let filteredNecessaryEventTemplateList: EventTemplate[] = eventTemplates
      .filter((template) => template.category === Category.NECESSARY.toLowerCase())
      .sort((a, b) => a.order - b.order);
    console.log(filteredNecessaryEventTemplateList);
    if (this.necessaryCounter < filteredNecessaryEventTemplateList.length &&
      filteredNecessaryEventTemplateList[this.necessaryCounter].duration <= gap.duration) {
      let necessaryTemplate = filteredNecessaryEventTemplateList[this.necessaryCounter];
      let categoriesMap = this.parseCategoriesCSV(necessaryTemplate.categories);

      if (categoriesMap.get(weightedCategories[0][0]) > 0) {
        let endTime = new Date(gap.start);
        endTime.setMinutes(endTime.getMinutes() + necessaryTemplate.duration);

        let newEvent: DayEvent = {
          id: uuid.v4(),
          userId: necessaryTemplate.userId,
          startTime: Timestamp.fromDate(new Date(gap.start)),
          endTime: Timestamp.fromDate(endTime),
          name: necessaryTemplate.name,
          categories: necessaryTemplate.categories,
          type: 'generated',
          day: day.id
        };

        this.necessaryCounter++;
        return newEvent;
      }
    }

    return undefined;
  }


  private chooseEventTemplate(category: String, day: Day, gap: Gap, eventTemplates: EventTemplate[]) {
    let newEvent: DayEvent = {
      userId: day.userId,
      id: uuid.v4(),
      startTime: Timestamp.fromDate(new Date(gap.start)),
      endTime: Timestamp.fromDate(new Date(gap.start)),
      name: '',
      categories: '',
      type: 'generated',
      day: day.id
    };

    let aggregatedDuration = 0;
    let templatesCount = 0;
    const duration =  calculateDurationInMinutes(gap.start, gap.end);
    const filteredEventTemplateList = eventTemplates
      .filter((eventTemplate) => eventTemplate.category === category.toLowerCase() && eventTemplate.duration <= duration);

    const totalWeight = filteredEventTemplateList
      .reduce((sum, eventTemplate) => sum + eventTemplate.weight, 0);

    if (totalWeight > 0) {
      while (aggregatedDuration < this.FIVE_MINUTES) {
        const randomNumber = Math.floor(Math.random() * totalWeight);
        let cumulativeWeight = 0;

        for (const eventTemplate of filteredEventTemplateList) {
          cumulativeWeight += eventTemplate.weight;

          if (randomNumber < cumulativeWeight) {
            this.output(eventTemplate);
            newEvent.name += eventTemplate.name;

            // calculate start and end time
            aggregatedDuration = aggregatedDuration + eventTemplate.duration;
            this.output('aggregatedDuration' + aggregatedDuration);
            const endTime = new Date(gap.start);
            endTime.setMinutes(endTime.getMinutes() + Math.round(aggregatedDuration / 5) * 5);
            newEvent.endTime = Timestamp.fromDate(endTime);
            newEvent.startTime = Timestamp.fromDate(gap.start);
            newEvent.categories = eventTemplate.categories;

            newEvent = this.postprocessEventTemplate(eventTemplate, eventTemplates, day, newEvent, gap);
            templatesCount++;
            if (templatesCount > 1) {
              newEvent.name += '-----------';
            }
            if (eventTemplate.room) {
              newEvent.name +=  eventTemplate.room;
            }

            break;
          }
        }
      }
    }

    if (!newEvent.categories) {
      newEvent.categories = category + ':' + aggregatedDuration;
    }


    return newEvent;
  }



private postprocessEventTemplate(eventTemplate: EventTemplate, eventTemplates: EventTemplate[], day: Day, newEvent: DayEvent, gap: Gap) {
  if (eventTemplate.postprocess !== undefined && eventTemplate.postprocess !== '') {
    this.output('postprocessing');
    if (eventTemplate.postprocess === this.WHOLE_DAY_POSTPROCESS) {
      let beginTime = dayBegin(day.day.toDate());
      let endTime = dayEnd(day.day.toDate());

      newEvent.categories = eventTemplate.categories;
      newEvent.startTime = Timestamp.fromDate(beginTime);
      newEvent.endTime = Timestamp.fromDate(endTime);
      newEvent.postprocess = this.WHOLE_DAY_POSTPROCESS;
      return newEvent;
    } else {
      let processedEvent = this.chooseEventTemplate(eventTemplate.postprocess, day, gap, eventTemplates);
      processedEvent.name = eventTemplate.name + ':' + processedEvent.name;
      return processedEvent;
    }
  }
  return newEvent;
}

  private updateWeights(weights: Map<string, number>, categoriesMap: Map<string, number>): Map<string, number> {
    for (const [key, value] of categoriesMap) {
      if (weights.has(key)) {
        weights.set(key, weights.get(key)! + value);
      } else {
        weights.set(key, value);
      }
    }
    return weights;
  }

  private findGapBetweenEvents(
    day: Day
  ): Gap | null {
    const beginTime = dayBegin(day.day.toDate());
    const endTime = dayEnd(day.day.toDate());
    let previousEndTime = new Date(beginTime);
    let events = day.resultEvents.sort((a, b) => a.startTime - b.startTime);
    this.output('result events');
    this.output(events);
    for (const event of events) {
      if (event.startTime.toDate() > previousEndTime) {
        return {
          start: previousEndTime,
          end: event.startTime.toDate(),
          duration: calculateDurationInMinutes(previousEndTime, event.startTime.toDate())
        }
      }
      previousEndTime = new Date(event.endTime.toDate());
    }

    if (previousEndTime < endTime) {
      return {
        start: previousEndTime,
        end: endTime,
        duration: calculateDurationInMinutes(previousEndTime, endTime)
      }
    }

    return null;
  }

  async addEvents(numberOfDays: number) {
    const nextDays = calculateDatesForNextDays(numberOfDays);

    for (const dayDate of nextDays) {
      const day = await this.dayService.getByDay(dayDate).toPromise();


        const weights = await this.getWeights(dayDate);
        this.addOptionalEvents(day, weights);
        await this.dayService.update(day.id, day);
    }
  }



  private addOptionalEvents(day: Day, weights: Map<string, number>) {
    if (day && day.optionalEvents && day.optionalEvents.length > 0) {

      for (const optionalEvent of day.optionalEvents) {

        // Check if optional event already exists
        if (day.resultEvents.some(resultEvent => resultEvent.id === optionalEvent.id)) {
          this.output('event already exists');
          this.output(optionalEvent.id);
          continue;
        }

        // check if has no overlap
        if (this.checkIfOverlaps(optionalEvent, day.resultEvents)) {
          this.output('hasOverlap');
          continue;
        }

        const weightedCategories = this.getWeightedCategories(weights, categoryCoefficient);
        this.output('weighted categories:');
        this.output(weightedCategories);
        const mostWantedCategory = weightedCategories[0][0];
        this.output('Most wanted category:' + mostWantedCategory);

        const categoriesMap = this.parseCategoriesCSV(optionalEvent.categories);

        if (categoriesMap.get(mostWantedCategory) > 0) {
          this.toastr.success('Add optional event ' + optionalEvent.name);
          this.output('Add optional event');
          this.output(optionalEvent);
          day.resultEvents.push(optionalEvent);

          this.updateWeights(weights, categoriesMap);
        }
      }
    }
  }

  // Read Events for last n days and then sum categories
  private async getWeights(dayDate: Date):  Promise<Map<string, number>> {
    try {
      const categoryWeightsMap = this.initializeCategoryWeightsMap();
      this.outputMap(categoryWeightsMap);

      const allEvents: DayEvent[] = await this.dayService.getEventsFromPast(dayDate, 10).toPromise();
      for (const event of allEvents) {
        if (event.categories) {
          const categoryMap = this.parseCategoriesCSV(event.categories);

          for (const [category, weight] of categoryMap) {
            categoryWeightsMap.set(category, categoryWeightsMap.get(category) + weight);
          }
        }
      }

      this.outputMap(categoryWeightsMap);
      return categoryWeightsMap;
    } catch (error) {
      this.handleError(error);
      throw error; // Re-throw the error to propagate it up the call stack
    }

  }



  private getWeightedCategories(weights: Map<string, number>, categoryCoefficient: Record<string, number>): [string, number][] {
    const weightsSum = Array.from(weights.values()).reduce((sum, weight) => sum + weight, 0);
    this.output('weightsSum: ' + weightsSum);

    const weightedCategoriesArray = Array.from(weights.entries()).map(([key, value]) => {
      const weightsSumForCategory = weightsSum * categoryCoefficient[key];
      const weightsDifferenceForCategory = (value - weightsSumForCategory) / weightsSumForCategory;
      return [key, weightsDifferenceForCategory] as [string, number];
    });

    weightedCategoriesArray.sort((a, b) => a[1] - b[1]);
    return weightedCategoriesArray;
  }

  private checkIfOverlaps(newEvent: DayEvent, eventList: DayEvent[]): boolean {
    for (const existingEvent of eventList) {
      const startsDuringExisting = newEvent.startTime >= existingEvent.startTime && newEvent.startTime < existingEvent.endTime;
      const endsDuringExisting = newEvent.endTime > existingEvent.startTime && newEvent.endTime <= existingEvent.endTime;
      const encompassesExisting = newEvent.startTime <= existingEvent.startTime && newEvent.endTime >= existingEvent.endTime;

      if (startsDuringExisting || endsDuringExisting || encompassesExisting) {
        // There's an overlap
        return true;
      }
    }

    return false;
  }

  private parseCategoriesCSV(categoriesCSV: string): Map<string, number> {
    const categoryMap = this.initializeCategoryWeightsMap();
    const categoryArray = categoriesCSV.split(';');

    for (const categoryInfo of categoryArray) {
      const [category, weightStr] = categoryInfo.split(':');
      const weight = parseInt(weightStr);

      if (!isNaN(weight) && categoryMap.has(category)) {
        categoryMap.set(category, weight);
      } else {
        // Handle invalid or missing category names
        console.error(`Invalid or missing category: ${category}`);
      }
    }

    return categoryMap;
  }

  private initializeCategoryWeightsMap(): Map<string, number> {
    const categoryWeightsMap = new Map<string, number>();
    Object.values(Category).forEach(category => {
      categoryWeightsMap.set(category, 0);
    });
    return categoryWeightsMap;
  }

  private outputMap(mapp: Map<string, number>) {
    for(let record of mapp) {
      this.output(record[0] + "m: " + record[1] + "s")
    }
  }

  private handleError(error: any) {
    console.error(error);
  }

  private output(output: any) {
    console.log(JSON.parse(JSON.stringify(output)));
  }
}
