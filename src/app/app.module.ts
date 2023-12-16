import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {environment} from "../environments/environment";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from "./components/header/header.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import { AddEventTemplateComponent } from './components/event-template/add-event-template/add-event-template.component';
import { EditEventTemplateComponent } from './components/event-template/edit-event-template/edit-event-template.component';
import {
  EventTemplateListComponent,
  NgModalConfirm
} from './components/event-template/event-template-list/event-template-list.component';
import {ToastrModule} from "ngx-toastr";
import {NgxPaginationModule} from "ngx-pagination";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesListComponent } from './shared/categories-list/categories-list.component';
import { DaysListComponent } from './components/days/days-list/days-list.component';
import {DayEventListComponent} from "./components/days/day-event-template-list/day-event-list.component";
import {AddEventComponent} from "./components/days/add-event/add-event.component";
import {EditEventComponent} from "./components/days/edit-event/edit-event.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FlexLayoutModule, FlexModule} from "@angular/flex-layout";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    HeaderComponent,
    AddEventTemplateComponent,
    EditEventTemplateComponent,
    EventTemplateListComponent,
    NgModalConfirm,
    CategoriesListComponent,
    DaysListComponent,
    DayEventListComponent,
    AddEventComponent,
    EditEventComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    NgbModule,
    FormsModule,
    MatSidenavModule,
    FlexLayoutModule,
    FlexModule,
    MatIconModule,
    MatListModule
  ],
  providers: [],
  exports: [
    HeaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
