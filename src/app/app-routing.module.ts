import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import {AuthGuard} from "./shared/guard/auth.guard";
import {EventTemplateListComponent} from "./components/event-template/event-template-list/event-template-list.component";
import {EditEventTemplateComponent} from "./components/event-template/edit-event-template/edit-event-template.component";
import {AddEventTemplateComponent} from "./components/event-template/add-event-template/add-event-template.component";
import {DaysListComponent} from "./components/days/days-list/days-list.component";
import {DayEventListComponent} from "./components/days/day-event-list/day-event-list.component";
import {AddEventComponent} from "./components/days/add-event/add-event.component";
import {EditEventComponent} from "./components/days/edit-event/edit-event.component";
import {RandomEventComponent} from "./components/random/random-event/random-event.component";

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'random-event', component: RandomEventComponent, canActivate: [AuthGuard] },
  { path: 'event-template', component: EventTemplateListComponent, canActivate: [AuthGuard] },
  { path: 'event-template/:category', component: EventTemplateListComponent, canActivate: [AuthGuard] },
  { path: 'edit-event-template/:id', component: EditEventTemplateComponent, canActivate: [AuthGuard] },
  { path: 'days/:day/events/:id/edit/:type', component: EditEventComponent, canActivate: [AuthGuard] },
  { path: 'add-event-template/:category', component: AddEventTemplateComponent, canActivate: [AuthGuard] },
  { path: 'days', component: DaysListComponent, canActivate: [AuthGuard] },
  { path: 'days/:day/events', component: DayEventListComponent, canActivate: [AuthGuard] },
  { path: 'days/:day/events/add/type/:type', component: AddEventComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
