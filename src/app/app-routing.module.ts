import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/front-user/dashboard/dashboard.component';

const routes: Routes = [
  // { path: "", pathMatch: "full", redirectTo: 'login' },
  { path: "", component: DashboardComponent, pathMatch: "full" },
  { path: "admin",
    loadChildren: './components/admin-container/admin-container.module#AdminContainerModule',
    data: {
      preload: false, delay: true,
    },
  },
  { path: '**', redirectTo: 'admin', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
