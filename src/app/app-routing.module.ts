import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/recipes/1', pathMatch: 'full' },
 // { path: 'artworks', loadChildren: () => import('./recipes/artworks.module').then(m => m.ArtworksModule) },
 // { path: 'references', loadChildren: () => import('./shopping-list/references.module').then(m => m.ReferencesModule) },
 // { path: 'references', loadChildren: () => import('./shopping-list/references.module').then(m => m.ReferencesModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth-feature.module').then(m => m.AuthFeatureModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'confirm-email', loadChildren: () => import('./confirm-email/confirm-email.module').then(m => m.ConfirmEmailModule) },
  { path: 'reset-password', loadChildren: () => import('./confirm-email/confirm-email.module').then(m => m.ConfirmEmailModule) },
  { path: 'profile', loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule) },
  { path: 'totp', loadChildren: () => import('./totp/totp.module').then(m => m.TotpModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
