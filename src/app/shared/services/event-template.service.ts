import {Injectable} from '@angular/core';
import {EventTemplate} from "../model/event-template"
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Subscription} from "rxjs";
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class EventTemplateService {

  private dbPath = '/event-templates';

  public eventTemplateList: EventTemplate[] = [];

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
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data()
              } as EventTemplate;
            })
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
    eventTemplate.category = eventTemplate.category.toLowerCase();
    return this.firestore.collection(this.dbPath).add({...eventTemplate});
  }

  public deleteById(id: string): void {
    this.firestore.doc(this.dbPath + '/' + id).delete();
  }

  public updateById(eventTemplate: EventTemplate): Promise<any> {
    return this.firestore.doc(this.dbPath + '/' + eventTemplate.id).update({...eventTemplate});
  }
}
