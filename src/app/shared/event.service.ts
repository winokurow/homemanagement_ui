import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection, DocumentData,
  QuerySnapshot
} from '@angular/fire/compat/firestore';
import {AuthService} from "./services/auth.service";
import {DayEvent} from "./event";
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private dbPath = '/events';

  eventRef: AngularFirestoreCollection<DayEvent>;

  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.eventRef = this.db.collection<DayEvent>(this.dbPath);
  }

  create(event: DayEvent): any {
    event.userId = this.authService.userData.uid;
    return this.eventRef.add({ ...event });
  }

  getAll(dayId: string): AngularFirestoreCollection<DayEvent> {
    return this.db.collection<DayEvent>(this.dbPath, ref =>
      ref.where('userId', '==', this.authService.userData.uid).where('day', '==', dayId));
  }

  delete(id: string): Promise<void> {
    return this.eventRef.doc(id).delete();
  }

  get(id:string):  Observable<DocumentSnapshot<DayEvent>> {
    return this.db.collection<DayEvent>(this.dbPath, ref => ref.where('userId', '==', this.authService.userData.uid)).doc(id).get();
  }

  getEventsForDate(day:string):  Observable<DayEvent[]> {
    return this.db.collection<DayEvent>(this.dbPath, ref => ref.where('userId', '==', this.authService.userData.uid).where('day', '==', day))
      .get().pipe(
        map((querySnapshot: QuerySnapshot<DocumentData>) => {
          const events: DayEvent[] = [];
          querySnapshot.forEach((doc) => {
            let event = doc.data() as DayEvent;
            event.id = doc.id;
            events.push(event);
          });
          return events;
        })
      );
  }

  update(id: string, event: DayEvent): Promise<void> {
    const data = {
      id: id,
      startTime: event.startTime,
      endTime: event.endTime,
      name: event.name,
      type: event.type,
      categories: event.categories,
      day: event.day,
    };
    return this.eventRef.doc(id).update(data);
  }
}
