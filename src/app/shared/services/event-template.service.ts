import {Injectable} from '@angular/core';
import {EventTemplate} from "../model/event-template"
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {BehaviorSubject, Subscription} from "rxjs";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {Timestamp} from "@firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class EventTemplateService {

  private dbPath = '/event-templates';

  public eventTemplateList: EventTemplate[] = [];

  eventTemplateListSubject: BehaviorSubject<EventTemplate[]> = new BehaviorSubject([]);

  private userUid = '';

  private eventTemplateSubscription: Subscription = Subscription.EMPTY;

  constructor(public firestore: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(state => {
      if (state?.uid) {
        console.log('state?.uid')
        console.log(state?.uid)
        this.userUid = state.uid;
        this.eventTemplateSubscription = this.firestore.collection<any>(
          this.dbPath, ref => {
            return ref.where('userId', '==', state.uid);
          }).snapshotChanges().subscribe(data => {
          this.eventTemplateList = data
            .map(e => {
              const eventTemplate : EventTemplate = {
                id: e.payload.doc.id,
                ...e.payload.doc.data()
              } as EventTemplate;
              // Convert Firebase Timestamps to Date
              if (eventTemplate.creationDate instanceof Timestamp) {
                eventTemplate.creationDate = eventTemplate.creationDate.toDate();
              }
              return eventTemplate;
            })
          this.eventTemplateListSubject.next(data
            .map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data()
              } as EventTemplate;
            }));
        });
      } else {
        if (this.eventTemplateSubscription) {
          this.eventTemplateSubscription.unsubscribe();
        }

        this.userUid = '';
        this.eventTemplateList = [];
      }
    });
  }

  public add(eventTemplate: EventTemplate): Promise<any> {
    eventTemplate.userId = this.userUid;
    eventTemplate.creationDate = new Date();
    eventTemplate.category = eventTemplate.category.toLowerCase();
    const convertedEventTemplate = this.convertDatesToTimestamps(eventTemplate);
    return this.firestore.collection(this.dbPath).add({...convertedEventTemplate});
  }

  public deleteById(id: string): void {
    this.firestore.doc(this.dbPath + '/' + id).delete();
  }

  public updateById(eventTemplate: EventTemplate): Promise<any> {
    const convertedEventTemplate = this.convertDatesToTimestamps(eventTemplate);
    return this.firestore.doc(this.dbPath + '/' + eventTemplate.id).update({...convertedEventTemplate});
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
