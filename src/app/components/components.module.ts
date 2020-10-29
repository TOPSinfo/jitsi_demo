import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSmartModalModule } from 'ngx-smart-modal';

// import { fakeBackendProvider } from '../app/_helper';
// import { AlertComponent } from '../app/_directives';
import { AlertService } from '../../app/_services';
// import { JwtInterceptor, ErrorInterceptor } from '../app/_helper';

import { HeaderComponent } from "./header/header.component";
import { AddUserComponent } from "./add-user/add-user.component";
import { CallHistoryComponent } from "./call-history/call-history.component";
import { DashboardComponent } from "./front-user/dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { UserListComponent } from "./user-list/user-list.component";
// import { NotificationComponent } from './notification/notification.component';
import { AdminContainerModule } from './admin-container/admin-container.module';
import { ModalComponentComponent } from './front-user/modal-component/modal-component.component';
// import { FeedbackComponent } from './feedback/feedback.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@NgModule({
    exports: [
        HeaderComponent,
        AddUserComponent,
        CallHistoryComponent,
        DashboardComponent,
        LoginComponent,
        UserListComponent,
        // NotificationComponent,
        AdminContainerModule
    ],
  declarations: [
    // AppComponent,
    HeaderComponent,
    AddUserComponent,
    CallHistoryComponent,
    DashboardComponent,
    LoginComponent,
    UserListComponent,
    ModalComponentComponent,
    SafePipe
    // FeedbackComponent,
    // NotificationComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    BrowserModule,
    // AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AdminContainerModule,
    NgxSmartModalModule.forChild()
  ],
  providers: [
    AlertService,
//     { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
//     { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

//     // provider used to create fake backend
//     // fakeBackendProvider

  ],
//   bootstrap: [AppComponent]
})
export class ComponentModule { }
