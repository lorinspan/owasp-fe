import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { XssComponent } from './pages/tests/xss/xss.component';
import { BrokenAuthComponent } from './pages/tests/broken-auth/broken-auth.component';
import {BrokenAccessControlComponent} from './pages/tests/broken-access-control/broken-access-control.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tests/broken-access-control', component: BrokenAccessControlComponent },
  { path: 'tests/broken-access-control/:user_id', component: BrokenAccessControlComponent }, // ✅ Ruta dinamică adăugată
  { path: 'tests/xss', component: XssComponent },
  { path: 'tests/broken-auth', component: BrokenAuthComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Fallback dacă ruta nu există
];
