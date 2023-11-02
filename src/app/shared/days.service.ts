import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
  QuerySnapshot
} from '@angular/fire/compat/firestore';
import {AuthService} from "./services/auth.service";
import {Observable} from "rxjs";
import {Day} from "./day";
import {map, take} from "rxjs/operators";
import {DayEvent} from "./event";
import firebase from "firebase/compat";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import {Action} from "@angular/fire/compat/database";
import {doc, Firestore, getDoc, getFirestore} from "@angular/fire/firestore";
import {initializeApp} from "firebase/app";
import {FirebaseApp} from "@angular/fire/app";

@Injectable({
  providedIn: 'root'
})
export class DayService {

  private dbPath = '/days';
  private firestoreFirebase;



  dayRef: AngularFirestoreCollection<Day>;

  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.dayRef = this.db.collection<Day>(this.dbPath);
  }


  getAll(): AngularFirestoreCollection<Day> {
      return this.db.collection<Day>(this.dbPath, ref =>
        ref.where('userId', '==', this.authService.userData.uid));
  }

  async get(id:string):  Promise<Day> {
    let document = await this.dayRef.doc(id).get().toPromise();
    return document.data() as Day;
  }

  getByDay(day:Date): Observable<Day> {
    return this.db.collection<Day>(this.dbPath, ref => ref.where('userId', '==', this.authService.userData.uid).where('day', '==', day))
      .get().pipe(
        map((querySnapshot: QuerySnapshot<DocumentData>) => {
          if (querySnapshot.docs.length > 0) {
            let foundday = querySnapshot.docs[0].data() as Day;
            foundday.id = querySnapshot.docs[0].id;
            return foundday;
          }
          return undefined;
        })
      );
  }

  create(day: Day): any {
    day.userId = this.authService.userData.uid;
    return this.dayRef.add({ ...day });
  }

  update(id: string, day: Day): Promise<void> {
    const data = {
      id: id,
      day: day.day,
      state: day.state,
      resultEvents: day.resultEvents
    };
    return this.dayRef.doc(id).update(data);
  }

  getEventsFromPast(fromDate: Date, interval: number): Observable<DayEvent[]> {
    const daysTo = new Date(fromDate);
    fromDate.setDate(fromDate.getDate() + 1);
    daysTo.setDate(daysTo.getDate() - interval);
    return this.db.collection<Day>(this.dbPath, ref => ref.where('userId', '==', this.authService.userData.uid)
      .where('day', '<=', fromDate)
      .where('day', '>', daysTo))
      .valueChanges().pipe(
        take(1),
      ).pipe(
        map((days: Day[]) => {
          // Extract resultEvents from the retrieved days
          const resultEvents: DayEvent[] = [];
          days.forEach(day => {
            resultEvents.push(...day.resultEvents);
          });
          return resultEvents;
        })
      );
  }
}
