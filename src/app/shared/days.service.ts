import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {AuthService} from "./services/auth.service";
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import {Day} from "./day";

@Injectable({
  providedIn: 'root'
})
export class DayService {

  private dbPath = '/days';

  dayRef: AngularFirestoreCollection<Day>;

  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.dayRef = this.db.collection<Day>(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Day> {
      return this.db.collection<Day>(this.dbPath, ref =>
        ref.where('userId', '==', this.authService.userData.uid));
  }

  get(id:string):  Observable<DocumentSnapshot<Day>> {
    return this.db.collection<Day>(this.dbPath, ref => ref.where('userId', '==', this.authService.userData.uid)).doc(id).get();
  }
  create(day: Day): any {
    day.userId = this.authService.userData.uid;
    return this.dayRef.add({ ...day });
  }

  update(id: string, day: Day): Promise<void> {
    const data = {
      id: id,
      day: day.day,
      mandatoryEvents: day.mandatoryEvents,
      optionalEvents: day.optionalEvents,
      resultEvents: day.resultEvents
    };
    return this.dayRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.dayRef.doc(id).delete();
  }
}
