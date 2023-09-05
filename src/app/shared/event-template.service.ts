import {Injectable} from '@angular/core';
import {EventTemplate} from "./event-template"
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {AuthService} from "./services/auth.service";
import {BehaviorSubject, Observable} from "rxjs";
import firebase from "firebase/compat";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable({
  providedIn: 'root'
})
export class EventTemplateService {

  private dbPath = '/event-templates';

  eventTemplateRef: AngularFirestoreCollection<EventTemplate>;

  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.eventTemplateRef = this.db.collection<EventTemplate>(this.dbPath);
  }

  getAll(category: String): AngularFirestoreCollection<EventTemplate> {
    if (category != '') {
      return this.db.collection<EventTemplate>(this.dbPath, ref =>
        ref.where('userId', '==', this.authService.userData.uid).where('category', '==', category));
    } else {
      return this.db.collection<EventTemplate>(this.dbPath, ref =>
        ref.where('userId', '==', this.authService.userData.uid));
    }
  }

  get(id:string):  Observable<DocumentSnapshot<EventTemplate>> {
    return this.db.collection<EventTemplate>(this.dbPath, ref => ref.where('userId', '==', this.authService.userData.uid)).doc(id).get();
  }

  create(eventTemplate: EventTemplate): any {
    eventTemplate.userId = this.authService.userData.uid;
    return this.eventTemplateRef.add({ ...eventTemplate });
  }

  update(id: string, eventTemplate: EventTemplate): Promise<void> {
    const data = {
      id: id,
      order: eventTemplate.order,
      name: eventTemplate.name,
      duration: eventTemplate.duration,
      weight: eventTemplate.weight,
      categories: eventTemplate.categories,
      postProcessing: eventTemplate.postProcessing,
      category: eventTemplate.category,
    };
    return this.eventTemplateRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.eventTemplateRef.doc(id).delete();
  }
}
