import {Injectable} from '@angular/core';
import {EventTemplate} from "./event-template"
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/compat/firestore';
import {AuthService} from "./services/auth.service";
import {Observable} from "rxjs";
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
        ref.where('userId', '==', this.authService.userData.uid).where('category', '==', category.toLowerCase()));
    } else {
      return this.db.collection<EventTemplate>(this.dbPath, ref =>
        ref.where('userId', '==', this.authService.userData.uid));
    }
  }

  get(id:string):  Observable<DocumentSnapshot<EventTemplate>> {
    return this.db.collection<EventTemplate>(this.dbPath, ref => ref.where('userId', '==', this.authService.userData.uid)).doc(id).get();
  }


  create(eventTemplate: EventTemplate): Promise<DocumentReference<EventTemplate>> {
    console.log('Saving');

    eventTemplate.userId = this.authService.userData.uid;
    console.log(eventTemplate);
    eventTemplate.category = eventTemplate.category.toLowerCase();
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
      postProcessing: eventTemplate.postprocess,
      category: eventTemplate.category,
    };
    return this.eventTemplateRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.eventTemplateRef.doc(id).delete();
  }
}
