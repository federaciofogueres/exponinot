import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { NinotsComponent } from './components/ninots/ninots.component';
import { NinotComponent } from './components/ninot/ninot.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'ninots', component: NinotsComponent },
    { path: 'ninots/:id', component: NinotComponent },
];
