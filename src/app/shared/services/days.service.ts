import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {BehaviorSubject, Subscription} from "rxjs";
import {Day} from "../model/day";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {DayEvent} from "../model/event";
import {Timestamp} from "@firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class DayService {

  private dbPath = '/days';

  dayList: BehaviorSubject<any[]> = new BehaviorSubject([]);

  private userUid = '';

  private daySubscription: Subscription = Subscription.EMPTY;

  constructor(public firestore: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(state => {
      if (state?.uid) {
        this.userUid = state.uid;
        this.daySubscription = this.firestore.collection<any>(
          this.dbPath, ref => {
            return ref.where('userId', '==', state.uid);
          }).snapshotChanges().subscribe(data => {

          this.dayList.next(data
            .map(e => {
              const dayData = e.payload.doc.data() as Day;

              // Convert Firebase Timestamps to Date
              if (dayData.dayDate instanceof Timestamp) {
                dayData.dayDate = dayData.dayDate.toDate();
              }
              if (dayData.day instanceof Timestamp) {
                dayData.dayDate = dayData.day.toDate();
              }

              dayData.resultEvents = dayData.resultEvents.map((event: DayEvent) => {
                if (event.startTime instanceof Timestamp) {
                  event.startTime = event.startTime.toDate();
                }
                if (event.endTime instanceof Timestamp) {
                  event.endTime = event.endTime.toDate();
                }
                return event;
              });
              if (dayData.optionalEvents) {
                dayData.optionalEvents = dayData.optionalEvents.map((event: DayEvent) => {
                  if (event.startTime instanceof Timestamp) {
                    event.startTime = event.startTime.toDate();
                  }
                  if (event.endTime instanceof Timestamp) {
                    event.endTime = event.endTime.toDate();
                  }
                  return event;
                });
              }
              return {
                id: e.payload.doc.id,
                ...dayData
              } as Day;
            }))
        })
      } else {
        if (this.daySubscription) {
          this.daySubscription.unsubscribe();
        }

        this.userUid = '';
        this.dayList.next([]);
      }
    });
  }

  public add(day: Day): Promise<DocumentReference<any>> {
    day.userId = this.userUid;
    const convertedDay = this.convertDatesToTimestamps(day);
    return this.firestore.collection(this.dbPath).add({...convertedDay});
  }

  public updateById(day: Day): Promise<any> {
    const convertedDay = this.convertDatesToTimestamps(day);
    return this.firestore.doc(this.dbPath + '/' + day.id).update({...convertedDay});
  }

  public getResultEventsFromPast(fromDate: Date, interval: number): DayEvent[] {
    const toDate = new Date(fromDate);
    toDate.setDate(fromDate.getDate() - interval);
    return this.dayList.getValue()
      .filter(day => day.dayDate.getTime() >= toDate.getTime() && day.dayDate.getTime() <= fromDate.getTime())
      .flatMap(day => day.resultEvents);
  }

  public getByDay(dayDate:Date): Day {
    return this.dayList.getValue().find(day => day.dayDate.getTime() == dayDate.getTime());
  }


  private convertDatesToTimestamps(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertDatesToTimestamps(item));
    } else {
      // Iterate through each property in the object
      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          // Check if the property is an object
          if (typeof obj[prop] === 'object' && obj[prop] !== null) {
            // Recursively convert dates in nested objects
            obj[prop] = this.convertDatesToTimestamps(obj[prop]);
          } else if (prop.endsWith('Date') && obj[prop] instanceof Date) {
            // Convert date fields to Firebase Timestamp
            obj[prop] = Timestamp.fromDate(obj[prop]);
          }
        }
      }

    }
    return obj;
  }

}

