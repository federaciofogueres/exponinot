import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { NinotComponent } from './components/ninot/ninot.component';
import { NinotsComponent } from './components/ninots/ninots.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'ninots', component: NinotsComponent },
    { path: 'ninots/:id', component: NinotComponent },
    { path: '**', redirectTo: 'home'},
];
