import { AuthGuard } from './../../_guards/auth.guard';
import { AdminContainerComponent } from './admin-container.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { CallHistoryComponent } from './../call-history/call-history.component';
import { UserListComponent } from './../user-list/user-list.component';
import { AddUserComponent } from './../add-user/add-user.component';
import { LoginComponent } from './../login/login.component';

const routes: Routes = [
  {
    path: '',
    component: AdminContainerComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: "full" },
      { path: 'login', component: LoginComponent },
      { path: 'add-user', canActivate: [ AuthGuard ], component: AddUserComponent },
      { path: 'edit-user', canActivate: [ AuthGuard ], component: AddUserComponent },
      { path: 'user-list', canActivate: [ AuthGuard ], component: UserListComponent },
      { path: 'dashboard', canActivate: [ AuthGuard ], component: CallHistoryComponent }
    ]
  },
  // { path: '', redirectTo: 'admin', pathMatch: "full" },
  // { path: '**', redirectTo: 'admin', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminContainerRoutingModule { }
