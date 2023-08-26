import {Injectable, OnInit} from '@angular/core';
import {EventTemplate} from "./event-template"
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {AuthService} from "./services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class EventTemplateService {
  private dbPath = '/event-templates';

  eventTemplateRef: AngularFirestoreCollection<EventTemplate>;


  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.eventTemplateRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<EventTemplate> {
    return this.eventTemplateRef;
  }

  create(eventTemplate: EventTemplate): any {
    eventTemplate.userId = this.authService.userData.uid;
    console.log('eventTemplate')
    console.log(eventTemplate)
    return this.eventTemplateRef.add({ ...eventTemplate });
  }

  update(id: string, data: any): Promise<void> {
    return this.eventTemplateRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.eventTemplateRef.doc(id).delete();
  }
}
