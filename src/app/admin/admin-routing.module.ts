import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';

import { UsersResolverService } from './users/users-resolver.service';
import { MediaResolverService } from './media/media-resolver.service';
import { SessionsResolverService } from './sessions/sessions-resolver.service';

import { AdminComponent } from './admin.component';

import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserListComponent } from './users/user-list/user-list.component';

import { MediaListComponent } from './media/media-list/media-list.component';
import { MediaEditComponent } from './media/media-edit/media-edit.component';

import { SessionsListComponent } from './sessions/sessions-list/sessions-list.component';
import { SessionsEditComponent } from './sessions/sessions-edit/sessions-edit.component';


const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users', component: AdminComponent,  canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '1', pathMatch: 'full'  },
      { path: ':pn', component: UserListComponent, canActivate: [RoleGuard] , data: { expectedRole: 'admin_role_CRUD' } },
      { path: ':pn/new', component: UserEditComponent, },
      { path: ':pn/:id', component: UserEditComponent, resolve: [UsersResolverService] }
    ]
  },
  {
    path: 'sessions', component: AdminComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '1', pathMatch: 'full'  },
      { path: ':pn', component: SessionsListComponent, canActivate: [RoleGuard] , data: { expectedRole: 'admin_role_CRUD' } },
      { path: ':pn/new', component: SessionsEditComponent, },
      { path: ':pn/:id', component: SessionsEditComponent, resolve: [SessionsResolverService] }
    ]
  },
  {
    path: 'media', component: AdminComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '1', pathMatch: 'full'  },
      { path: ':pn', component: MediaListComponent, canActivate: [RoleGuard] , data: { expectedRole: 'admin_role_CRUD' } },
      { path: ':pn/new', component: MediaEditComponent, },
      { path: ':pn/:id', component: MediaEditComponent, resolve: [MediaResolverService] }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
