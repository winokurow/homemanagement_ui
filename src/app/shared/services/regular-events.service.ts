import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {DayEvent} from "../model/event";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class RegularEventService {
  private eventsUrl = 'assets/regular-events.json';

  private optionalEventsUrl = 'assets/regular-optional-events.json';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<DayEvent[]> {
    return this.http.get<DayEvent[]>(this.eventsUrl);
  }

  getOptionalEvents(): Observable<DayEvent[]> {
    return this.http.get<DayEvent[]>(this.optionalEventsUrl);
  }
}
