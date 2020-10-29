import { NotificationComponent } from './../notification/notification.component';
import { AdminContainerComponent } from './admin-container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminContainerRoutingModule } from './admin-container-routing.module';
import { FeedbackComponent} from '../front-user/feedback/feedback.component'

@NgModule({
  declarations: [
    NotificationComponent,
    AdminContainerComponent,
    FeedbackComponent
  ],
  exports: [
    NotificationComponent,
    FeedbackComponent
    // RouterModule
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule,
    // RouterModule.forRoot([]),
    AdminContainerRoutingModule,
    NgxSmartModalModule.forChild()
  ],
})
export class AdminContainerModule { }
