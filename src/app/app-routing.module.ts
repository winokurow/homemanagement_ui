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
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'planer', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'event-template', component: EventTemplateListComponent, canActivate: [AuthGuard] },
  { path: 'edit-event-template/:id', component: EditEventTemplateComponent, canActivate: [AuthGuard] },
  { path: 'add-event-template', component: AddEventTemplateComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
