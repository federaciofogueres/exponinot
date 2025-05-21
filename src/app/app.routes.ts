import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NinotComponent } from './components/ninot/ninot.component';
import { NinotsComponent } from './components/ninots/ninots.component';
import { RestrictedAccessComponent } from './components/restricted-access/restricted-access.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    // { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'ninots', component: NinotsComponent },
    // { path: 'ninots', component: NinotsComponent, canActivate: [AuthGuard] },
    { path: 'ninots/:id', component: NinotComponent },
    // { path: 'ninots/:id', component: NinotComponent, canActivate: [AuthGuard] },
    { path: 'restricted', component: RestrictedAccessComponent },
    { path: '**', redirectTo: 'home' },
];
