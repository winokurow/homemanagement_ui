import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {BehaviorSubject, Subscription} from "rxjs";
import {Day} from "../model/day";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {DayEvent} from "../model/event";

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

              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data()
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
    return this.firestore.collection(this.dbPath).add({...day});
  }

  public deleteById(id: string): void {
    this.firestore.doc(this.dbPath + '/' + id).delete();
  }

  public updateById(day: Day): Promise<any> {
    return this.firestore.doc(this.dbPath + '/' + day.id).update({...day});
  }

  getResultEventsFromPast(fromDate: Date, interval: number): DayEvent[] {
    const toDate = new Date(fromDate);
    toDate.setDate(fromDate.getDate() - interval);
    console.log('here');
    console.log(toDate);
    console.log(this.dayList.getValue());
    return this.dayList.getValue().filter(day => day.day.toDate().getTime() >= toDate.getTime() && day.day.toDate().getTime() <= fromDate.getTime())
      .flatMap(day => day.resultEvents);
  }

  getByDay(dayDate:Date): Day {
    return this.dayList.getValue().find(day => day.day.toDate().getTime() == dayDate.getTime());
  }
}
