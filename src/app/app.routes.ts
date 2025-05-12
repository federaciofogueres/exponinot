import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { NinotComponent } from './components/ninot/ninot.component';
import { NinotsComponent } from './components/ninots/ninots.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: 'ninots', component: NinotsComponent },
    { path: 'ninots/:id', component: NinotComponent },
    { path: '**', redirectTo: 'home'},
];
