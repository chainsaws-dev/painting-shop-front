import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/admin/users/1', pathMatch: 'full' },
 // { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) },
 // { path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) },
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
